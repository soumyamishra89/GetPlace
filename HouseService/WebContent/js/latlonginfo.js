/**
 * 
 */
var map, heatmap, loc, heatmapData;
var placesToSearch= ['transport', 'grocery_or_supermarket', 'shopping_mall', 'restaurant'];
var request = { radius: '500',
		    rankby: 'prominence'
		  };

/**
 * Loads the heatmap as per the points of interest specified by the user
 */
function loadHeatMap() {
    heatmapData = new google.maps.MVCArray();
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: map
    });
	var xhttp = new XMLHttpRequest();
	var nearbyStopsURL = [];
	if(placesToSearch.indexOf('transport')!=-1) {
		nearbyStopsURL.push("https://api.resrobot.se/location.nearbystops?key=0eab2bb0-a7dc-420e-9385-eda6641ad913");
		nearbyStopsURL.push("&format=json&maxNo=1000");
		nearbyStopsURL.push("&originCoordLat=59.329630&originCoordLong=18.059338");
		nearbyStopsURL.push("&r=500")
		//  xhttp.open("GET", "http://api.sl.se/api2/nearbystops/Json?key=509ecd92161d475fa8db07d3eed30e26&originCoordLat=59.293611&originCoordLong=18.083056&maxresults=1000&radius=2000", true);
		xhttp.open("GET", nearbyStopsURL.join(""), true)  
		xhttp.send();
		  
		xhttp.onreadystatechange = function() {
		  if (xhttp.readyState == 4 && xhttp.status == 200) {
		   	var response = xhttp.responseText;
		   	if(response.indexOf("error")==-1) {
		   		var stopsInfo = JSON.parse(response);
		   		var weight = placesToSearch.length-placesToSearch.indexOf('transport');
		   		
		   		for(var i=0, stopLoc;stopLoc=stopsInfo.StopLocation[i];i++){
		   			heatmapData.push({location: new google.maps.LatLng(stopLoc.lat, stopLoc.lon), weight:weight});	
		   		}
		    }
		    	//document.getElementById("demo").innerHTML = heatmapData;
		  }
		}; 
	}
	
	if(placesToSearch.indexOf('grocery_or_supermarket')!=-1) {
		request['type']='grocery_or_supermarket'
			
	  	service = new google.maps.places.PlacesService(map);
	  	service.radarSearch(request, function (results, status) {
	  		addPlaceToHeatMap(results, status, 'grocery_or_supermarket');
	  	});
	}
	if(placesToSearch.indexOf('shopping_mall')!=-1) {
		request['type']='shopping_mall'
			
	  	service = new google.maps.places.PlacesService(map);
	  	service.radarSearch(request, function (results, status) {
	  		addPlaceToHeatMap(results, status, 'shopping_mall');
	  	});
	}
	if(placesToSearch.indexOf('restaurant')!=-1) {
		request['type']='restaurant'
	  	
	  	service = new google.maps.places.PlacesService(map);
	  	service.radarSearch(request, function (results, status) {
	  		addPlaceToHeatMap(results, status, 'restaurant');
	  	});
	}
}
	/*var map = new google.maps.Map(document.getElementById('map'), {
	    center: loc,
	    zoom: 15,
	    scrollwheel: false
	});*/

function initMap() {
	loc = new google.maps.LatLng(59.333344, 18.056963999999994);
	// adding location of search for request to place search
	request['location'] = loc;
	map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: loc,
    mapTypeId: google.maps.MapTypeId.MAP
  });
	
	loadHeatMap();
}
	
    /*function getPoints() {
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
    }*/

function addPlaceToHeatMap(results, status, placeType) {
	  if (status == google.maps.places.PlacesServiceStatus.OK) {
  		  var weight = placesToSearch.length - placesToSearch.indexOf(placeType);
  		  
  		  for (var i = 0; i < results.length; i++) {
  			  var place = results[i];
  	      /* place.geometry.location,place.name, place.types */
  	      //console.log(place.types.contains("restaurant"));
  			  heatmapData.push({location: place.geometry.location, weight:weight});
  			//heatmapData.push(place.geometry.location);
  		  }
  	  }
  	
    
//    if(pagination.hasNextPage){
//    	 pagination.nextPage();
//     }    
  
}