#!/bin/bash
echo "starting script"
echo $PATH
Now_daily = $(date +%d-%b-daily) 

node ./updateData.js
git add --all 
gti commit -m  "Daly dataupdate ($Now_daily)"
git push origin 
