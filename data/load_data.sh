#!/bin/bash

DATA_DIR="temp-data"

if [ ! -d "$DATA_DIR" ]; then
  mkdir $DATA_DIR
fi

cd $DATA_DIR


ZAST_UZEMI="zastavitelne_uzemi"
CENOVA_MAPA="cenova_mapa"

# VYMEZENÍ ZASTAVITELNÉHO ÚZEMÍ (ÚZEMNÍ PLÁN)
echo "# fetching ---->  $ZAST_UZEMI"
curl -S http://opendata.iprpraha.cz/CUR/PUP/PVP_FVUzastavitelne_p/WGS_84/PVP_FVUzastavitelne_p_shp.zip > $ZAST_UZEMI.zip

echo

unzip -o $ZAST_UZEMI.zip
rm $ZAST_UZEMI.zip

shp2pgsql -I -s 2263 *.shp $ZAST_UZEMI |  PGPASSWORD='postgres' psql -U postgres -d test
rm -f *


HLUKOVÁ MAPA - DEN
echo
echo "# fetching ---->  $CENOVA_MAPA"
curl -S http://opendata.iprpraha.cz/CUR/SED/SED_CenovaMapa_p/WGS_84/SED_CenovaMapa_p_shp.zip > $CENOVA_MAPA.zip

echo

unzip -o $CENOVA_MAPA.zip
rm $CENOVA_MAPA.zip

shp2pgsql -I -s 2263 *.shp $CENOVA_MAPA |  PGPASSWORD='postgres' psql -U postgres -d test
rm -f *



