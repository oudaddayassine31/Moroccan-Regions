// Initialize the map
const map = L.map('map').setView([31.7917, -7.0926], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Variable to store GeoJSON data
let geoJsonData;

// Load GeoJSON for Moroccan regions
fetch('data/region.geojson')
  .then(response => response.json())
  .then(data => {
    geoJsonData = data; // Store GeoJSON data in a variable

    const regionLayers = {}; // Object to hold polygon layers

    // Add GeoJSON to map and create a mapping for polygons
    L.geoJSON(data, {
      style: function (feature) {
        return {
          color: '#3388ff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.5
        };
      },
      onEachFeature: function (feature, layer) {
        // Store the layer in the regionLayers object with the region name as key
        if (feature.properties && feature.properties.Nom_Region) {
          const regionName = feature.properties.Nom_Region;
          regionLayers[regionName] = layer; // Map region name to its layer

          // Bind popup for region name
          layer.bindPopup(regionName);
        }
      }
    }).addTo(map);

    // Add event listeners for the sidebar list items
    const regionItems = document.querySelectorAll('.region'); // Select all region items

    regionItems.forEach(item => {
      const regionName = item.textContent; // Get the region name from the <li>

      item.addEventListener('mouseover', () => {
        if (regionLayers[regionName]) {
          regionLayers[regionName].setStyle({ fillColor: 'red' }); // Change fill color on hover
        }
      });

      item.addEventListener('mouseout', () => {
        if (regionLayers[regionName]) {
          regionLayers[regionName].setStyle({ fillColor: '#3388ff' }); // Reset fill color when not hovering
        }
      });
    });
  })
  .catch(error => console.error('Error loading GeoJSON:', error));
