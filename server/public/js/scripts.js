const ACCESS_TOKEN = 'pk.eyJ1Ijoibm9uYWN0aXZlIiwiYSI6ImNqb2xndnRqcDBvM2czcHFhc3puY3d0dHkifQ.y7f1jyxJase9pRWpTtntew';

const API = 'http://localhost:3000/api';
const OPENSTREETMAP_API = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const MAPBOX_API ='https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'

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
    'priceMap': null
}

function getJsonData(dataURL) {
    return $.ajax({
        url: dataURL,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
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
            addLayer();
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

function addLayer () {
    if (layers['priceMap']) {
        map.addLayer(layers['priceMap']);
        return;
    }

    getJsonData(`${API}/territory`).then((results) => {
        layers['priceMap'] = L.geoJSON(results, {
            style: {
                color: '#000',
                fillColor: '#0e0e0e0',
                fillOpacity: .6
            },
            onEachFeature: onEachFeature
        })
        map.addLayer(layers['priceMap']);
    });
};

map.on('click', function (e) {
    let lat = e.latlng.lat;
    let lng = e.latlng.lng;

    // setMark(`lat: ${lat} <br> lng: ${lng}`, lat, lng);


    getJsonData(`${API}/noise`).then((results) => {
        test = L.geoJSON(results, {
            style: {
                color: '#000',
                fillColor: 'green',
                fillOpacity: .6
            }
        })
        map.addLayer(test);
    });

});


function setMark(text, lat, lng) {
    let selectedPoint = L.marker([lat, lng]).addTo(map);
    selectedPoint.bindPopup(`<b>${text}.<b/>`).openPopup();
}




$('#menu-toggle').click(function (e) {
    e.preventDefault();
    $('#wrapper').toggleClass('toggled');
});