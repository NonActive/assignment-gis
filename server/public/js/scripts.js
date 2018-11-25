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

let layers = {
    'price-map': null,
    'air-quality': null,
    'traffic-nosise-map': null, 
    'noise-map': null
}

let cityZoneLayer;

function removeLayer(layer) {
    if (typeof (layer) !== 'undefined') {
        map.removeLayer(layer);
    }
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

function styleNoiseMap(feature) {
    let noiseLevel = feature.properties.level;
    const min = feature.properties.min;
    const max = feature.properties.max;
    console.log(feature);

    let color = calculateRedGreen(noiseLevel, min, max);

    return {
        color: color,
        fillColor: color,
        fillOpacity: 0.5
    }
};

function styleAirQualityMap(feature) {
    const gridlevel = feature.properties.gridvalue;
    const min = feature.properties.min;
    const max = feature.properties.max;

    let color = calculateRedGreen(gridlevel, min, max);

    return {
        color: color,
        fillColor: color,
        fillOpacity: 0.5
    }
};

function stylePriceMap(feature) {
    const price = feature.properties.price !== 'N' ? +feature.properties.price : null;
    console.log(feature.properties.price);
    const min = feature.properties.min;
    const max = feature.properties.max;

    let color = calculateRedGreen(price, min, max);

    return {
        color: color,
        fillColor: color,
        fillOpacity: 0.5
    }
};

function calculateRedGreen(value, min, max) {
    let percent = (value - min) / (max - min);

    let portion = Math.floor((255 * 2) * percent);

    return portion > 255 ? rgb_str(255, 255 - (portion - 255), 0) : rgb_str(portion, 255, 0);
}

function rgb_str(r, g, b) {
    var hexval = 0x1000000 + b + 0x100 * g + 0x10000 * r;
    return '#' + hexval.toString(16).substr(1);
}

function addLayer(layer, layerName) {
    if (layer) {
        map.addLayer(layer);
        return;
    }

    switch (layerName) {
        case 'price-map':
            getJsonData(`${API}/price-map`).then((results) => {
                layer = L.geoJSON(results, {
                    style: stylePriceMap
                });

                layers[layerName] = layer;
                map.addLayer(layer);
            });
            break;
        case 'noise-map':
            getJsonData(`${API}/noise-map`).then((results) => {
                layer = L.geoJSON(results, {
                    style: styleNoiseMap
                });

                layers[layerName] = layer;
                map.addLayer(layer);
            });
            break;
        case 'air-quality':
            getJsonData(`${API}/air-quality`).then((results) => {
                layer = L.geoJSON(results, {
                    style: styleAirQualityMap
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
        removeLayer(infoMarker);

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

$('#menu-toggle').on('click', function (e) {
    e.preventDefault();
    $('#wrapper').toggleClass('toggled');
});

$('#clear-button').on('click', function (e) {
    e.preventDefault();
    removeLayer(infoMarker);
    removeLayer(highlightArea);
});



$(document).ready(function () {
    let table = $('#cityZonesTable').DataTable({
        columns: [
            { 'data': 'gid' },
            { 'data': 'name' },
            { 'data': 'air_quality' },
            { 'data': 'noise_level' },
            { 'data': 'price' },
        ],
        columnDefs: [
            { targets: [0], visible: false },
        ]
    });

    $('#example_filter input').keyup(function () {
        table.search(
            jQuery.fn.DataTable.ext.type.search.string(this.value)
        ).draw()
    });

    $('#cityZonesTable tbody').on('click', 'tr', function () {
        var data = table.row(this).data();

        // hide modal on select
        $('#cityZonesModal').modal('hide');

        removeLayer(cityZoneLayer);

        let zoneId = data.gid;
        getJsonData(`${API}/city-zone/${zoneId}`).then((results) => {
            cityZoneLayer = L.geoJSON(results, {
                style: {
                    color: '#CC0000',
                    fillColor: '#C9C9C9',
                    fillOpacity: .8
                },
                onEachFeature: function (feature, layer) {
                    layer.bindTooltip(feature.properties.name, {
                        permanent: true, 
                        direction: 'top'
                    });
                }
            });
            map.addLayer(cityZoneLayer);
        });
    });

    $('#remove-zone').on('click', function (e) {
        e.preventDefault();
        removeLayer(cityZoneLayer);
    });

    getJsonData(`${API}/city-zone`).then((results) => {
        table.rows.add(results).draw();
    });
});