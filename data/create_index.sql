﻿CREATE INDEX price_index ON cenova_mapa USING GIST(geom_new)
CREATE INDEX noise_index ON noise_level USING GIST(geom)
CREATE INDEX air_index ON bonita_klimatu_mapa USING GIST(geom_new)
CREATE INDEX osm_polygon_index ON planet_osm_polygon USING GIST(way)
CREATE INDEX leisure_index ON planet_osm_polygon(leisure)