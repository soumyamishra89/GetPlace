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
	    var heatmapData = [];
		var xhttp = new XMLHttpRequest();
		var nearbyStopsURL = [];
		
		nearbyStopsURL.push("https://api.resrobot.se/location.nearbystops?key=0eab2bb0-a7dc-420e-9385-eda6641ad913");
		nearbyStopsURL.push("&format=json&maxNo=1000");
		nearbyStopsURL.push("&originCoordLat=59.329630&originCoordLong=18.059338");
		nearbyStopsURL.push("&r=2000")
		//  xhttp.open("GET", "http://api.sl.se/api2/nearbystops/Json?key=509ecd92161d475fa8db07d3eed30e26&originCoordLat=59.293611&originCoordLong=18.083056&maxresults=1000&radius=2000", true);
		xhttp.open("GET", nearbyStopsURL.join(""), true)  
		xhttp.send();
		  
		  xhttp.onreadystatechange = function() {
		    if (xhttp.readyState == 4 && xhttp.status == 200) {
		    	var response = xhttp.responseText;
		    	if(response.indexOf("error")==-1){
		    		var stopsInfo = JSON.parse(response);
		    		for(var i=0, stopLoc;stopLoc=stopsInfo.StopLocation[i];i++){
		    			//console.log(stopLoc.lat + " : " + stopLoc.lon);
		    			heatmapData.push(new google.maps.LatLng(stopLoc.lat, stopLoc.lon));
		    		}
		    		//console.log(heatmapData.length);
		    	}
		    	//document.getElementById("demo").innerHTML = heatmapData;
		    }
		  }; 
		  console.log(heatmapData.length);
		  return heatmapData;
	}
	/*var map = new google.maps.Map(document.getElementById('map'), {
	    center: loc,
	    zoom: 15,
	    scrollwheel: false
	});*/
	
	var map, heatmap;

    function initMap() {
    	var loc = new google.maps.LatLng(59.333344, 18.056963999999994);
    	//loadDoc();
    	//console.log("data:"+heatmapData.length);
    	map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: loc,
        mapTypeId: google.maps.MapTypeId.MAP
      });

      heatmap = new google.maps.visualization.HeatmapLayer({
        data: loadDoc(),
        map: map
      });
      var request = {
  		    location: loc,
  		    radius: '2000',
  		    types: ['grocery_or_supermarket', 'shopping_mall', 'restaurant']
  		  };
  	
  	service = new google.maps.places.PlacesService(map);
  	service.nearbySearch(request, callback);
    }
	
    function getPoints() {
        return [
          new google.maps.LatLng(59.333344, 18.056963999999994),
          new google.maps.LatLng(59.333192, 18.05431199999998),
          new google.maps.LatLng(59.33, 18.05055500000003),
          new google.maps.LatLng(59.332661, 18.066123999999945),
          new google.maps.LatLng(59.330684, 18.06845199999998),
          new google.maps.LatLng(59.329848, 18.068874999999935),
          new google.maps.LatLng(59.332553, 18.068389000000025),
          new google.maps.LatLng(59.325407, 18.066367000000014),
          new google.maps.LatLng(59.326872, 18.068794000000025),
          new google.maps.LatLng(59.324122, 18.06267200000002),
          new google.maps.LatLng(59.324122, 18.06267200000002),
          new google.maps.LatLng(59.332401, 18.048406),
          new google.maps.LatLng(59.335529, 18.063535),
          new google.maps.LatLng(59.335538, 18.055067000000008)];
    }

function callback(results, status, pagination) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
	  //console.log(results.length);
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      /* place.geometry.location,place.name, place.types */
      //console.log(place.types.contains("restaurant"));
      if(pagination.hasNextPage){
    	  pagination.nextPage();
      }
    }
  }
}