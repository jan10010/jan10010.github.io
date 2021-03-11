#!/bin/bash
echo "starting script"
echo $PATH
cd /home/pi/Desktop/jan10010.github.io
node ./code/updateData.js
echo "download complite"
cd geojsonMap
echo "Starting compression"
mapshaper -i ./RKI_Corona_Landkreise.geojson -o precision=0.001 -simplify dp 10% -o format=geojson -o ./RKI_Corona_Landkreise.geojson
echo "compression complite"
cd ..
echo "Starting upload"
git add --all
git commit -m  "Daly data update 2"
git push origin master
