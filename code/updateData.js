
const request = require('request');
function loadData(){
    const request = require('request');
    const fetch = require('node-fetch');

let url = "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=GEN,BEZ,deaths,cases_per_100k,cases_per_population,county,last_update,cases7_per_100k,recovered,cases7_bl_per_100k,cases7_bl,death7_bl,cases7_lk,death7_lk,cases7_per_100k_txt,BL,cases,death_rate&returnGeometry=false&outSR=4326&f=json";

let settings = { method: "Get" };

fetch(url, settings).then(res => res.json())
.then((out) =>{
    const fs = require("fs");
    var fileContent = out.features;
    
    let data = JSON.stringify(fileContent);
    //console.log(data)
    fs.writeFileSync('data.json', data);

    }).catch(err => console.error(err));
    
}


function loadDataGepjson(){
    const http = require('https'); // or 'https' for https:// URLs
    const fs = require('fs');
    console.log("Starting Download of GeoJson Data")

    const file = fs.createWriteStream("./geojsonMap/RKI_Corona_Landkreise.geojson");
    const request = http.get("https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.geojson", function(response) {
      response.pipe(file);
    });

}

loadData()         
loadDataGepjson()   
