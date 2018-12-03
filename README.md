# Overview

This application allows you to find a most appropriate place for living in Prague. The user is able to find out basic information about city zone or selected places such as air quality, noise level or even the price of land. 

There are three possible types of scenarios in this application:
- **color visualization on the map** - the user can choose visualization of the noise level or air quality for Prague
- **search by city zone** -  each zone contains average values of noise level, air quality and price of land
- **specific location** - gives a detail info for selected location on the map, searches for leisure places in a near region and highlight the territorial area depending on availability

#### Screenshots from the application:

1. Color visualization of air quality

![Screenshot](screenshots/scenario01.png)

2. Overview of city zones searched by name

![Screenshot](screenshots/scenario02.png)

3. Detail info about selected location on the map

![Screenshot](screenshots/scenario03.png)

The application has 2 separate parts, the client which is a [frontend web application](#frontend) using mapbox API and leaflet library and the [backend application](#backend) written in [Node.js](https://nodejs.org/en/), backed by PostGIS. The frontend application communicates with backend using a [REST API](#api).

**Technologies used**: Javascript, jQuery, [Leaflet](https://leafletjs.com/), Node.js, Express, PostgreSQL, PostGIS

# Frontend

The frontend application is a static HTML page (`index.html`), which shows a mapbox.js widget. It is displaying hotels, which are mostly in cities, thus the map style is based on the Emerald style. I modified the style to better highlight main sightseeing points, restaurants and bus stops, since they are all important when selecting a hotel. I also highlighted rails tracks to assist in finding a quiet location.

All relevant frontend code is in `application.js` which is referenced from `index.html`. The frontend code is very simple, its only responsibilities are:
- detecting user's location, using the standard [web location API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation)
- displaying the sidebar panel with hotel list and filtering controls, driving the user interaction and calling the appropriate backend APIs
- displaying geo features by overlaying the map with a geojson layer, the geojson is provided directly by backend APIs

# Backend

The backend application is written in [Node.js](https://nodejs.org/en/) using the [Express](https://expressjs.com/) framework and is responsible for serving static files to the client, querying geo data from the database and processing some data. Module **db** is used for querying the PostgreSQL database. Queries are stored in queries directory and loaded by using the initQuery function in sql.js. Queries returning geo data are constructed in the way that they directly return 'Feature' GeoJSON format. Therefore, no further processing is required.

## Data

Data about Prague lasure places is coming directly from Open Street Maps. I downloaded an extent covering whole Prague (around 1.5GB) and imported it using the `osm2pgsql` tool into the standard OSM schema in WGS 84 with hstore enabled. To speedup the queries I created an index on geometry columns `way` or `geom_new`, created from `geom` column by conversion from multi-polygon (2263) to polygon (4326). 

Database consists of following tables:
* **bonita_klimatu_mapa** -
* **hlukova_mapa__den** -
* **mestske_casti** -
* **cenova_mapa** -
* **zastavitelne_uzemi** -
* **planet_osm_polygon** -


## Data sources

- [Open Street Maps](https://www.openstreetmap.org/) - for the Prague region
- [Geoportal Praha](http://www.geoportalpraha.cz/cs/opendata#.XARrvHVKg3E) - environment data and territorial data


## Api

**Find hotels in proximity to coordinates**

`GET /search?lat=25346&long=46346123`

**Find hotels by name, sorted by proximity and quality**

`GET /search?name=hviezda&lat=25346&long=46346123`

### Response

API calls return json responses with 2 top-level keys, `hotels` and `geojson`. `hotels` contains an array of hotel data for the sidebar, one entry per matched hotel. Hotel attributes are (mostly self-evident):
```
{
  "name": "Modra hviezda",
  "style": "modern", # cuisine style
  "stars": 3,
  "address": "Panska 31"
  "image_url": "/assets/hotels/652.png"
}
```
`geojson` contains a geojson with locations of all matched hotels and style definitions.
