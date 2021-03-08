// Initialize and add the map
let map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    minZoom: 6,
    mapTypeControl: false,
    zoomControl: false,
    scaleControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    mapId: "d198803c89e39e79",
    latLngBounds: {
        north: 11,
        south: 0,
        east: 52,
        west: 50,
      },

    center: { lat: 51.3, lng: 10.4 },
  });
  // NOTE: This uses cross-domain XHR, and may not work on older browsers.
  map.data.loadGeoJson(
    "./RKI_Corona_Landkreise.geojson"
  );
  console.log(map)
  map.data.setStyle(function(feature) {
    var color = 'green';
    if (feature.getProperty('cases7_per_100k')> 80) {
      color = "maroon";
    }else if(feature.getProperty('cases7_per_100k')> 60){
        color = "darkred";
    }else if(feature.getProperty('cases7_per_100k')> 50){
        color = "indianred";
    }else if(feature.getProperty('cases7_per_100k')> 30){
        color = "green";
    }else if(feature.getProperty('cases7_per_100k')> 0){
        color = "Lime";
    }
    return /** @type {!google.maps.Data.StyleOptions} */({
      fillColor: color,
      strokeColor: "gray",
      strokeWeight: 2
    });
  });

  function createEntry(locationName,listOfInformation){
    var informationAsHTMLString = "";
    for(i=0; i<listOfInformation.length;i++){
        if(i>=10){break}
        informationAsHTMLString = informationAsHTMLString + '<li class="locatonInformation"><div class="row"><div class="six columns informationName"><p>'+listOfInformation[i][0]+'</p></div><div class="six columns information"><p>'+listOfInformation[i][1]+'</p></div></div>'
    }

    var template = '<p class="locatonName">' +locationName +'</p><ul class="locationInformatons">'+ informationAsHTMLString + '</li>'
    
    document.getElementById("location").innerHTML = template


}

  map.data.addListener('mouseover', function(event) {
    map.data.revertStyle();
    map.data.overrideStyle(event.feature, {strokeWeight: 2});
    let entry = [{
        "GEN":event.feature.getProperty('GEN'),
        "cases7_per_100k":event.feature.getProperty('cases7_per_100k'),
        "cases":event.feature.getProperty('cases'),
        "last_update":event.feature.getProperty('last_update'),
        "deaths":event.feature.getProperty('deaths'),
        "BEZ":event.feature.getProperty('BEZ'),
        "county":event.feature.getProperty('county'),
        "BL":event.feature.getProperty('BL')
    }];
    entry = entry[0]

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

    createEntry(
        locationHedding
            ,[
            ["Inzident mittel 7 Tage: ", String(entry.cases7_per_100k).slice(0,5)],
            ["Gesamte Fälle: ", entry.cases],
            ["Zuletzt Aktualiesiert am: ", String(entry.last_update).slice(0,10)],
            ["Tote Insgesamt: ", entry.deaths]
    ]);
    
  });

map.data.addListener('mouseout', function(event) {
    map.data.revertStyle();
  });

  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  //map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  document.getElementById("locationButton").appendChild(locationButton)
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });



}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }


