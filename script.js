// Assuming you have already fetched and stored your GeoJSON in a variable
let geojsonData; // Variable to hold GeoJSON data

fetch('data/region.geojson')
    .then(response => response.json())
    .then(data => {
        geojsonData = data; // Store the GeoJSON data
        L.geoJSON(geojsonData, {
            style: function (feature) {
                return {
                    color: '#3388ff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.5
                };
            },
            onEachFeature: function (feature, layer) {
                // Bind popup for region name
                if (feature.properties && feature.properties.Nom_Region) {
                    layer.bindPopup(feature.properties.Nom_Region);

                    // Add to sidebar
                    const listItem = document.createElement('li');
                    listItem.classList.add('sidebar-list-item');
                    listItem.textContent = feature.properties.Nom_Region;
                    document.getElementById('region-list').appendChild(listItem);

                    // Zoom to region on click
                    listItem.addEventListener('click', function () {
                        map.fitBounds(layer.getBounds());
                    });

                    // Change polygon color and image on hover
                    listItem.addEventListener('mouseenter', function () {
                        layer.setStyle({ fillColor: 'red' }); // Change polygon color to red
                        const regionClass = Array.from(listItem.classList).find(cls => !isNaN(cls)); // Get the numeric class
                        document.querySelector('.img').src = `images/${regionClass}.png`; // Change the image
                    });

                    listItem.addEventListener('mouseleave', function () {
                        layer.setStyle({ fillColor: '#3388ff' }); // Reset polygon color
                        document.querySelector('.img').src = 'images/flag.png'; // Reset the image
                    });
                }
            }
        }).addTo(map);
    });
