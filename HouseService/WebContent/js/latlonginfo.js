/**
 * 
 */
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
function loadDoc() {
		var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
		    if (xhttp.readyState == 4 && xhttp.status == 200) {
		    	var response = xhttp.responseText;
		    	if(response.indexOf("error")==-1){
		    		var stopsInfo = JSON.parse(response);
		    		for(var i=0, stopLoc;stopLoc=stopsInfo.StopLocation[i];i++){
		    			console.log(stopLoc.lat + " : " + stopLoc.lon);
		    		}
		    	}
		    	document.getElementById("demo").innerHTML = xhttp.responseText;
		    }
		  };
		  var nearbyStopsURL = [];
		  nearbyStopsURL.push("https://api.resrobot.se/location.nearbystops?key=0eab2bb0-a7dc-420e-9385-eda6641ad913");
		  nearbyStopsURL.push("&format=json&maxNo=1000");
		  nearbyStopsURL.push("&originCoordLat=59.329630&originCoordLong=18.059338");
		  nearbyStopsURL.push("&r=2000")
		//  xhttp.open("GET", "http://api.sl.se/api2/nearbystops/Json?key=509ecd92161d475fa8db07d3eed30e26&originCoordLat=59.293611&originCoordLong=18.083056&maxresults=1000&radius=2000", true);
		xhttp.open("GET", nearbyStopsURL.join(""), true)  
		xhttp.send();
	}
	var loc = new google.maps.LatLng(59.329630, 18.059338);
	var map = new google.maps.Map(document.getElementById('map'), {
	    center: loc,
	    zoom: 15,
	    scrollwheel: false
	});
	
	var request = {
		    location: loc,
		    radius: '2000',
		    types: ['grocery_or_supermarket', 'shopping_mall', 'restaurant']
		  };
	
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);


function callback(results, status, pagination) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
	  console.log(results.length);
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      /* place.geometry.location,place.name, place.types */
      console.log(place.types.contains("restaurant"));
      if(pagination.hasNextPage){
    	  pagination.nextPage();
      }
    }
  }
}