
function search(){
    console.log("searching")
    searchBar = document.getElementById("searchbar");
    var request = searchBar.value.toUpperCase();
    var ul = document.getElementById("locations")
    var locatons = document.getElementsByClassName("location");
    //console.log(locatons)

    for(i = 0; i < locatons.length; i++){
        var locaton = locatons[i];
        locationName = locatons[i].getElementsByClassName("locatonName")[0].innerText.toUpperCase()  //.innerText.toUpperCase()
        //console.log(   locatons[0].getElementsByClassName("locatonName")[0].innerText.toUpperCase())
        if(locationName.indexOf(request)>-1){
            locatons[i].style.display = "";
            //console.log("in if")
        }else{
            locatons[i].style.display = "none";
        }
    }

    /*
    console.log(document.getElementById("searchbar").value)
    serch = document.getElementById("searchbar").value
    request = new Request("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=GEN%20%3D%20'" + serch +"'&outFields=GEN,cases7_per_100k&returnGeometry=false&outSR=&f=json");
    fetch(request)
        .then(res => res.json())
        .then((out) =>{
            console.log("Output", out.features[0].attributes);
    }).catch(err => console.error(err));
    */
}



addedListener = false;
function searchEnter(){
    if(addedListener == false){
        addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            search();
            }
        });
    }
    addedListener = true;
}

function createEntrys(listOfEntryes){
    addHTML = ""
    for(x=0; x<listOfEntryes.length; x++){
        locationName = listOfEntryes[x][0]
        
        listOfInformation = listOfEntryes[x][1]
        
        var informationAsHTMLString = "";
    for(i=0; i<listOfInformation.length;i++){
        if(i>=10){break}
        informationAsHTMLString = informationAsHTMLString + '<li class="locatonInformation"><div class="row"><div class="six columns informationName"><p>'+listOfInformation[i][0]+'</p></div><div class="six columns information"><p>'+listOfInformation[i][1]+'</p></div></div></li>'
    }

    var template = '<li class="location"><p class="locatonName">' +locationName +'</p><ul class="locationInformatons">'+ informationAsHTMLString + '</ul></li>'
    addHTML = addHTML + template;
    }
        

    document.getElementById("locations").innerHTML = document.getElementById("locations").innerHTML + addHTML


}


function createEntry(locationName,listOfInformation){
    var informationAsHTMLString = "";
    for(i=0; i<listOfInformation.length;i++){
        if(i>=10){break}
        informationAsHTMLString = informationAsHTMLString + '<li class="locatonInformation"><div class="row"><div class="six columns informationName"><p>'+listOfInformation[i][0]+'</p></div><div class="six columns information"><p>'+listOfInformation[i][1]+'</p></div></div></li>'
    }

    var template = '<li class="location"><p class="locatonName">' +locationName +'</p><ul class="locationInformatons">'+ informationAsHTMLString + '</li>'
    
    document.getElementById("locations").innerHTML = template


}
var shownData = false
function loadData(){
    request = new Request("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=GEN,cases7_per_100k&returnGeometry=false&outSR=&f=json");
    fetch(request)
        .then(res => res.json())
        .then((out) =>{
            const fs = require("fs");
            var fileContent = out.features;
            
            fs.writeFile("./data.txt", fileContent, (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
                console.log("File has been created");
            });
            shownData = true
    }).catch(err => console.error(err));

    
}

function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 function init() {
    loadJSON(function(response) {
     // Parse JSON string into object
       var data = JSON.parse(response);
       console.log(data[0].attributes)
       var i = 0
       var listOfEntryes = []
       while(i<=data.length-1){
            entry = data[i].attributes

            landKreis = entry.county
            bundesland = String(entry.BL)
            //bundesland.push(")")
            locatonType = entry.BEZ
            landKreis += " in "
            ///landKreis = " (" + Landkreis

            landKreis = String(landKreis).replace("LK ","")
            if(locatonType == "Kreisfreie Stadt" || landKreis.indexOf(entry.GEN) > -1 ){
                locatonType = ""
                //landKreis = " ("
            }

            var locationHedding = locatonType + " " + entry.GEN + " (" + landKreis + bundesland + ")"

            if((landKreis.length + entry.GEN.length + locatonType.length + entry.BL.length +4) >=50){
                landKreis = ""
                bundesland = ""
                locatonType = ""
                locationHedding = entry.GEN 
             }

            listOfEntryes.push([locationHedding
                ,[
                ["Inzident mittel 7 Tage: ", String(entry.cases7_per_100k).slice(0,5)],
                ["Gesamte Fälle: ", entry.cases],
                ["Zuletzt Aktualiesiert am: ", String(entry.last_update).slice(0,10)],
                ["Tote Insgesamt: ", entry.deaths]
            ]]);

            i = i+1
       }
       createEntrys(listOfEntryes);


    });
   }

 

function showData(){
    'use strict';

    let jsonData = require('data.json');

    console.log(jsonData);
}
addEventListener("load", function(){
    init();


})



//createEntry("test",[["Hallo"], ["Welt"]]);

function mapView(){
    window.location.replace("https://jan10010.github.io/geojsonMap/index.html");
}