#!/bin/bash
echo "starting script"
echo $PATH

node ./code/updateData.js
git add --all
git commit -m  "Daly data update 2"
git push origin master
