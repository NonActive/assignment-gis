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
    'air-quality': null,
    // 'traffic-nosise-map': null, 
    'noise-map': null
}

let cityZoneLayer, priceMapLayer;

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

let priceMapBtn = $('#show-price-map');

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

    let color = calculateRedGreen(noiseLevel, min, max);

    return {
        color: color,
        fillColor: color,
        fillOpacity: 0.5
    }
};

function onEachFeatureNoise(feature, layer) {
    layer.bindPopup(`<b>Noise level: </b>${feature.properties.level} dB`);
}

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

function onEachFeatureAirQuality(feature, layer) {
    layer.bindPopup(`<b>Level of air quality (lower number is better): </b>${feature.properties.gridvalue}`);
}

function stylePriceMap(feature) {
    const price = feature.properties.price !== 'N' ? +feature.properties.price : null;
    const min = feature.properties.min;
    const max = feature.properties.max;

    let color = calculateRedGreen(price, min, max);

    return {
        color: color,
        fillColor: color,
        fillOpacity: 0.5
    }
};

function onEachFeaturePrice(feature, layer) {
    layer.bindPopup(`<b>Price for m&sup2; </b>${feature.properties.price} CZK`);
}

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

        case 'noise-map':
            getJsonData(`${API}/noise-map`).then((results) => {
                layer = L.geoJSON(results, {
                    style: styleNoiseMap,
                    onEachFeature: onEachFeatureNoise
                });

                layers[layerName] = layer;
                map.addLayer(layer);
            });
            break;
        case 'air-quality':
            getJsonData(`${API}/air-quality`).then((results) => {
                layer = L.geoJSON(results, {
                    style: styleAirQualityMap,
                    onEachFeature: onEachFeatureAirQuality
                });

                layers[layerName] = layer;
                map.addLayer(layer);
            });
            break;
    }

};

let infoMarker, highlightArea;
let parkingLayer, radiusLayer;
map.on('click', function (e) {
    let lat = e.latlng.lat;
    let lng = e.latlng.lng;


    getJsonData(`${API}/point-info`, {
        point: [lng, lat]
    }).then((results) => {
        removeLayer(parkingLayer);
        removeLayer(infoMarker);
        removeLayer(radiusLayer);
        removeLayer(highlightArea);

        const pointInfo = results['point-info'];
        if (!pointInfo) {
            return;
        }

        radiusLayer = L.circle([lat, lng], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.2,
            radius: 500
        }).addTo(map);

        const parking = results['parking'];
        if (parking && parking.features !== null) {
            parkingLayer = L.geoJSON(parking)
            map.addLayer(parkingLayer);
        }

        const properties = pointInfo.properties;

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
            `<b>Latitude:</b> ${lat} <br>` +
            `<b>Longitude: </b> ${lng}<br>` +
            `<b>Price (m^2):</b> ${price} <br>` +
            `<b>Noise level:</b> ${noise} <br>` +
            `<b>Available:</b> ${available} <br>`,
            lat, lng
        );

        highlightArea = L.geoJSON(pointInfo, {
            style: function (feature) {
                const properties = pointInfo.properties;

                let fillColor;
                if (_.has(properties, 'zastavitelne')) {
                    fillColor = properties.zastavitelne === 'zastavitelne' ? '#00e500' : '#e50000';
                }

                return {
                    color: '#000',
                    fillOpacity: .4,
                    fillColor: fillColor,
                }
            }
        })
        map.addLayer(highlightArea);
    });
});


function setMark(text, lat, lng) {
    const properties = {
        radius: 3.5,
        fillColor: 'red',
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };


    let selectedPoint = L.circleMarker([lat, lng], properties).addTo(map);
    selectedPoint.bindTooltip(`${text}`, {
        permanent: true,
        direction: 'top'
    }).openPopup();

    return selectedPoint;
}

$('#menu-toggle').on('click', function (e) {
    e.preventDefault();
    $('#wrapper').toggleClass('toggled');
});

$('#clear-button').on('click', function (e) {
    e.preventDefault();
    removeLayer(parkingLayer);
    removeLayer(infoMarker);
    removeLayer(radiusLayer);
    removeLayer(highlightArea);
});


$('#show-price-map').on('click', function (e) {
    e.preventDefault();
    if (map.hasLayer(cityZoneLayer)) {
        if (map.hasLayer(priceMapLayer)) {
            priceMapBtn.find('a:first').removeClass('active');
            removeLayer(priceMapLayer);
            return;
        }

        priceMapBtn.find('a:first').addClass('active');
        let zoneId = priceMapBtn.data('gid');

        getJsonData(`${API}/price-map/${zoneId}`).then((results) => {
            priceMapLayer = L.geoJSON(results, {
                style: stylePriceMap,
                onEachFeature: onEachFeaturePrice
            });

            map.addLayer(priceMapLayer);
        });
    }
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
                    let center = layer.getBounds().getCenter();
                    map.setView(center, 13);

                    layer.bindTooltip(feature.properties.name, {
                        permanent: true,
                        direction: 'top'
                    });
                }
            });
            map.addLayer(cityZoneLayer);

            priceMapBtn.data('gid', zoneId);
            priceMapBtn.show(); // show price map option
        });
    });

    $('#remove-zone').on('click', function (e) {
        e.preventDefault();
        removeLayer(cityZoneLayer);
        removeLayer(priceMapLayer);

        priceMapBtn.hide();
        priceMapBtn.find('a:first').removeClass('active');
    });

    getJsonData(`${API}/city-zone`).then((results) => {
        table.rows.add(results).draw();
    });
});