// Initialize the map with Leaflet
const map = L.map('map').setView([31.7917, -7.0926], 5);

// Load and add the OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Variable to store GeoJSON data
let geoJsonData;

// Fetch and load the GeoJSON file containing the Moroccan regions
fetch('data/region.geojson')
  .then(response => response.json())
  .then(data => {
    geoJsonData = data; // Store GeoJSON data in a variable

    const regionLayers = {}; // Object to hold the polygon layers, mapped by region name
    let currentRegionSelected = null; // Store the currently selected region (by click)

    // Add the GeoJSON to the map and create polygons for each region
    L.geoJSON(data, {
      style: function (feature) {
        // Define the initial style for each region polygon
        return {
          color: '#3388ff',  // Border color of the polygon
          weight: 2,         // Border thickness
          opacity: 1,        // Border opacity
          fillOpacity: 0.5   // Polygon fill opacity
        };
      },
      onEachFeature: function (feature, layer) {
        // For each region, map its polygon layer by the region name
        if (feature.properties && feature.properties.Nom_Region) {
          const regionName = feature.properties.Nom_Region;
          regionLayers[regionName] = layer; // Map region name to the polygon layer

          // Bind a popup with the region name to each polygon
          layer.bindPopup(regionName);
        }
      }
    }).addTo(map);

    // Select all region <li> elements from the sidebar
    const regionItems = document.querySelectorAll('.region');

    const header = document.getElementById('reset-button')
    // Helper function to reset the selected region
    function resetToDefaultFlag() {
      if (currentRegionSelected) {
        regionLayers[currentRegionSelected].setStyle({ fillColor: '#3388ff' }); // Reset the previously selected region
        currentRegionSelected = null;
        map.setView([31.7917, -7.0926], 5) // Clear the selected region
      }
    }

    // Loop through each region <li> element
    regionItems.forEach(item => {
      const regionName = item.textContent; // Get the region name from the <li> text content

      // Event listener for when the mouse hovers over a region in the sidebar
      item.addEventListener('mouseover', () => {
        if (!currentRegionSelected && regionLayers[regionName]) {
          // Change the fill color of the corresponding region polygon to red on hover
          regionLayers[regionName].setStyle({ fillColor: 'red' });
        }
      });

      // Event listener for when the mouse stops hovering over a region in the sidebar
      item.addEventListener('mouseout', () => {
        if (!currentRegionSelected && regionLayers[regionName]) {
          // Reset the fill color of the polygon to its original color after hover ends
          regionLayers[regionName].setStyle({ fillColor: '#3388ff' });
        }
      });

      // Event listener for when the user clicks on a region in the sidebar
      item.addEventListener('click', () => {
        // If a region was previously selected, reset its color
        if (currentRegionSelected && regionLayers[currentRegionSelected]) {
          regionLayers[currentRegionSelected].setStyle({ fillColor: '#3388ff' });
        }

        // Set the clicked region as the selected region
        currentRegionSelected = regionName;
        regionLayers[regionName].setStyle({ fillColor: 'red' }); // Change fill color to red

        // Retrieve the polygon's geometry and calculate its centroid
        const regionGeometry = regionLayers[regionName].feature.geometry;

        // Calculate centroid using the coordinates
        const coordinates = regionGeometry.coordinates;
        const centroid = getCentroid(coordinates);

        // Set the map view to the calculated centroid and zoom level 9
        map.setView([centroid[1], centroid[0]], 7);
      });
    });

    // Function to calculate the centroid of a polygon
    function getCentroid(coords) {
      let lat = 0, lng = 0, n = 0;

      // For MultiPolygon (regions made up of multiple polygons)
      coords.forEach(polygon => {
        polygon[0].forEach(point => {
          lng += point[0];
          lat += point[1];
          n++;
        });
      });

      // Return the average of the coordinates as the centroid
      return [lng / n, lat / n];
    }

    header.addEventListener('click', resetToDefaultFlag);
     
  })
  .catch(error => console.error('Error loading GeoJSON:', error));
// Assuming you have a map object (Leaflet or other map library)


