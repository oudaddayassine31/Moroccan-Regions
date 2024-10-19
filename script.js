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

    // Log the final content of regionLayers to the console
    console.log('regionLayers:', regionLayers['BENI MELLAL-KHENIFRA'].feature.properties);

    // Select all region <li> elements from the sidebar
    const regionItems = document.querySelectorAll('.region');
    // Select the <img> tag where the Moroccan flag is displayed
    const flagImage = document.querySelector('.flag-container img');
    // Select the title elements (clicking on these will reset the flag to the default one)
    const sidebarTitle = document.querySelector('.sidebar-title');
    const locationIcon = document.querySelector('.material-icons-outlined');
    const header = document.querySelector('.header');

    // Chart.js initialization
    

    // Helper function to reset the map and image to the default flag
    function resetToDefaultFlag() {
      flagImage.src = 'images/flag.png'; // Reset the flag image to the default
      if (currentRegionSelected) {
        regionLayers[currentRegionSelected].setStyle({ fillColor: '#3388ff' }); // Reset the previously selected region
        currentRegionSelected = null; // Clear the selected region
      }
      
    }

    // Helper function to create and display the chart
   

    // Loop through each region <li> element
    regionItems.forEach(item => {
      const regionName = item.textContent; // Get the region name from the <li> text content
      const regionNumber = item.classList[1]; // Get the region number from the second class (e.g., '1', '2', etc.)

      // Event listener for when the mouse hovers over a region in the sidebar
      item.addEventListener('mouseover', () => {
        if (!currentRegionSelected && regionLayers[regionName]) {
          // Change the fill color of the corresponding region polygon to red on hover
          regionLayers[regionName].setStyle({ fillColor: 'red' });
          // Change the flag image to the region-specific image (e.g., '1.png', '2.png', etc.)
          flagImage.src = `images/${regionNumber}.png`;
        }
      });

      // Event listener for when the mouse stops hovering over a region in the sidebar
      item.addEventListener('mouseout', () => {
        if (!currentRegionSelected && regionLayers[regionName]) {
          // Reset the fill color of the polygon to its original color after hover ends
          regionLayers[regionName].setStyle({ fillColor: '#3388ff' });
          // Revert the flag image back to the default Moroccan flag
          flagImage.src = 'images/flag.png';
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
        flagImage.src = `images/${regionNumber}.png`; // Persist the flag for the clicked region

        // Fetch region data and display chart
        // Call function to create the chart
      });
    });

    // Event listener for resetting the flag when the title or location icon is clicked
    sidebarTitle.addEventListener('click', resetToDefaultFlag);
    locationIcon.addEventListener('click', resetToDefaultFlag);
    header.addEventListener('click', resetToDefaultFlag);
  })
  .catch(error => console.error('Error loading GeoJSON:', error)); // Handle errors during GeoJSON loading
