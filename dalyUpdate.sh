#!/bin/bash
echo "starting script"
echo $PATH
Now_daily = $(date +%d-%b-daily) 

node ./code/updateData.js
git add --all 
git commit -m  "Daly data update"
git push origin 
