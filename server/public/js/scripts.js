const ACCESS_TOKEN = 'pk.eyJ1Ijoibm9uYWN0aXZlIiwiYSI6ImNqb2xndnRqcDBvM2czcHFhc3puY3d0dHkifQ.y7f1jyxJase9pRWpTtntew';

const API = 'http://localhost:3000/api';
const OPENSTREETMAP_API = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const MAPBOX_API = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'

const mapOptions = {
    center: [50.08804, 14.42076],
    zoom: 10.5
}

// Creating a map object
let map = L.map('map', mapOptions);

map.on('load', function () {
    console.log('sevas');
});

// Base street layer
let streets = L.tileLayer(MAPBOX_API, {
    attribution: 'PDT 2018',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: ACCESS_TOKEN
});

map.addLayer(streets);

const layers = {
    'price-map': null,
    'noise-map': null
}

function getJsonData(dataURL, params) {
    return $.ajax({
        url: dataURL,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: params
    });
}

let toggleableLayerNames = _.keys(layers);
for (var i = 0; i < toggleableLayerNames.length; i++) {
    let layerName = toggleableLayerNames[i];

    let link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = layerName;

    link.onclick = function (e) {
        let clickedLayer = layers[this.textContent];

        e.preventDefault();
        e.stopPropagation();

        if (map.hasLayer(clickedLayer)) {
            map.removeLayer(clickedLayer);
            this.className = '';
        } else {
            addLayer(clickedLayer, this.textContent);
            this.className = 'active';
        }
    };

    var layersMenu = document.getElementById('menu');
    layersMenu.appendChild(link);
}

// function to build the HTML for the summary label using the selected feature's "name" property
function buildSummaryLabel(currentFeature) {
    console.log(currentFeature);
    var featureName = 'Unnamed feature';
    document.getElementById('summaryLabel').innerHTML = '<p style="font-size:18px"><b>' + featureName + '</b></p>';
}

function onEachFeature(feature, layer) {
    //bind click
    layer.on({
        click: function (e) {
            let lat = e.latlng.lat;
            let lng = e.latlng.lng;

            console.log('Lat: ', lat);
            console.log('Lng: ', lng);

            e.target.setStyle({
                fillColor: 'red'
            });

            // Insert some HTML with the feature name
            buildSummaryLabel(feature);
        }
    });
}

function addLayer(layer, layerName) {
    if (layer) {
        map.addLayer(layer);
        return;
    }

    switch (layerName) {
        case 'price-map':
            getJsonData(`${API}/territory`).then((results) => {
                layer = L.geoJSON(results, {
                    style: {
                        color: '#000',
                        fillColor: '#0e0e0e0',
                        fillOpacity: .6
                    },
                    onEachFeature: onEachFeature
                });

                layers[layerName] = layer;
                map.addLayer(layer);
            });
            break;
        case 'noise-map':
            getJsonData(`${API}/noise-map`).then((results) => {
                layer = L.geoJSON(results, {
                    style: {
                        color: '#000',
                        fillColor: '#e5e5e5e',
                        fillOpacity: .6
                    }
                });

                layers[layerName] = layer;
                map.addLayer(layer);
            });
            break;
    }

};

let infoMarker, highlightArea;
map.on('click', function (e) {
    let lat = e.latlng.lat;
    let lng = e.latlng.lng;


    getJsonData(`${API}/point-info`, {
        point: [lng, lat]
    }).then((results) => {
        if (typeof (infoMarker) !== 'undefined') {
            map.removeLayer(infoMarker);
        }

        const properties = results.properties;

        let available;
        if (_.has(properties, 'zastavitelne')) {
            available = properties.zastavitelne === 'zastavitelne' ? 'yes' : 'no';
        }

        let price;
        if (_.has(properties, 'cena')) {
            price = properties.cena === null || properties.cena === 'N' ? 'undefined' : `${properties.cena} CZK`
        }

        let noise;
        if (_.has(properties, 'noise')) {
            noise = `${properties.noise} dB`;
        }

        infoMarker = setMark(
            `<b>Latitude: ${lat} </b><br>` +
            `<b>Longitude: ${lng} </b><br>` +
            `<b>Price (m^2): ${price} </b><br>` +
            `<b>Noise level: ${noise} </b><br>` +
            `<b>Available: ${available} </b><br>`,
            lat, lng
        );

        if (typeof (highlightArea) !== 'undefined') {
            map.removeLayer(highlightArea);
        }

        highlightArea = L.geoJSON(results, {
            style: function (feature) {
                const properties = results.properties;

                let fillColor;
                if (_.has(properties, 'zastavitelne')) {
                    fillColor = properties.zastavitelne === 'zastavitelne' ? '#00e500' : '#e50000';
                }

                return {
                    color: '#000',
                    fillOpacity: .7,
                    fillColor: fillColor,
                }
            }
        })
        map.addLayer(highlightArea);
    });




    /*     getJsonData(`${API}/noise`).then((results) => {
            test = L.geoJSON(results, {
                style: {
                    color: '#000',
                    fillColor: 'green',
                    fillOpacity: .6
                }
            })
            map.addLayer(test);
        }); */

});


function setMark(text, lat, lng) {
    let selectedPoint = L.marker([lat, lng]).addTo(map);
    selectedPoint.bindPopup(`<b>${text}.<b/>`).openPopup();

    return selectedPoint;
}




$('#menu-toggle').click(function (e) {
    e.preventDefault();
    $('#wrapper').toggleClass('toggled');
});