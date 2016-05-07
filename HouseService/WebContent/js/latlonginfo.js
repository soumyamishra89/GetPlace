/**
 * 
 */
var map, heatmap, loc, heatmapData, radius = 500, overlay, tableau=[];
//var placesToSearch= ['publicTransport', 'grocery_or_supermarket', 'shopping_mall', 'restaurant'];
var request = { radius: radius,
		    rankby: 'prominence'
		  };
// function called on click of the search button	
function searchMap(){
	google.maps.event.trigger(locationsearchBox, 'focus')
    google.maps.event.trigger(locationsearchBox, 'keydown', {
        keyCode: 13
    });
}


var placesToSearch = [];
function addSearchCriteria() {
	placesToSearch = [];
	var placeOfInterests = document.getElementsByName('placeOfInterest');
	for(var i=0, searchCriteria; searchCriteria=placeOfInterests[i]; i++) {
		if(searchCriteria.checked) {
			placesToSearch.push(searchCriteria.value);
		}
	}
	var searchButton = document.getElementById('googlesearchButton');
    if(placesToSearch.length === 0) {
    	searchButton.disabled = true;
    } else {
    	searchButton.disabled = false;
    }
}
/**
 * Loads the heatmap as per the points of interest specified by the user
 */
function loadHeatMap() {
    request['location'] = map.getCenter();
    
	for(var i = 0, criteria; criteria = placesToSearch[i]; i++) {
		switch(criteria) {
			case 'publicTransport' :
					var xhttp = new XMLHttpRequest();
					var nearbyStopsURL = [];
					nearbyStopsURL.push("https://crossorigin.me/https://api.resrobot.se/location.nearbystops?key=0eab2bb0-a7dc-420e-9385-eda6641ad913");
					nearbyStopsURL.push("&format=json&maxNo=1000");
					
					nearbyStopsURL.push("&originCoordLat="+ map.getCenter().lat()+"&originCoordLong="+map.getCenter().lng());
					nearbyStopsURL.push("&r="+radius)
					//  xhttp.open("GET", "http://api.sl.se/api2/nearbystops/Json?key=509ecd92161d475fa8db07d3eed30e26&originCoordLat=59.293611&originCoordLong=18.083056&maxresults=1000&radius=2000", true);
					xhttp.open("GET", nearbyStopsURL.join(""), true);
					//xhttp.setRequestHeader("Access-Control-Allow-Origin", "https://api.resrobot.se/location.nearbystops")
					xhttp.send();
					  
					xhttp.onreadystatechange = function() {
					  if (xhttp.readyState == 4 && xhttp.status == 200) {
					   	var response = xhttp.responseText;
					   	if(response.indexOf("error")==-1) {
					   		var stopsInfo = JSON.parse(response);
					   		var weight = placesToSearch.length-placesToSearch.indexOf('publicTransport');
					   		tableau=[];
					   		if(stopsInfo && stopsInfo.StopLocation) {
						   		for(var i=0, stopLoc;stopLoc=stopsInfo.StopLocation[i];i++) {
						   			//heatmapData.push({location: new google.maps.LatLng(stopLoc.lat, stopLoc.lon), weight:weight});
						   			tableau.push([new google.maps.LatLng(stopLoc.lat, stopLoc.lon), stopLoc.products]);
						   		}
						   		addPublicTransportIcons();
						    }
					   	}
					    	//document.getElementById("demo").innerHTML = heatmapData;
					  }
			
					}; 
					break;
		
			case 'grocery_or_supermarket' :
					request['type']='grocery_or_supermarket'
						
				  	service = new google.maps.places.PlacesService(map);
				  	service.radarSearch(request, function (results, status) {
				  		addPlaceToHeatMap(results, status, 'grocery_or_supermarket');
				  	});
				  	break;
			case 'shopping_mall' :
					request['type']='shopping_mall'
						
				  	service = new google.maps.places.PlacesService(map);
				  	service.radarSearch(request, function (results, status) {
				  		addPlaceToHeatMap(results, status, 'shopping_mall');
				  	});	
				  	break;
		
			case 'restaurant' :
					request['type']='restaurant'
				  	
				  	service = new google.maps.places.PlacesService(map);
				  	service.radarSearch(request, function (results, status) {
				  		addPlaceToHeatMap(results, status, 'restaurant');
				  	});
				  	break;
		}
	}
}
	/*var map = new google.maps.Map(document.getElementById('map'), {
	    center: loc,
	    zoom: 15,
	    scrollwheel: false
	});*/

// callback called when the map is loaded
function initMap() {
	loc = new google.maps.LatLng(59.333344, 18.056963999999994);
	// adding location of search for request to place search
	   var styles = [
	                 {
	                     "featureType": "transit.station",
	                     "stylers": [{ "visibility": "off" }]
	                 }
	                 ];
	map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: loc,
    mapTypeId: google.maps.MapTypeId.MAP
  });
	 map.setOptions({ styles: styles });
	// once a map has been created, a searchbox to search for places is attached to it. check googlesearch.js
	
	// initialise a heatmap with only map. The data would be loaded once a place has been searched
    heatmap = new google.maps.visualization.HeatmapLayer({
        map: map
    });
    overlay = new google.maps.OverlayView();
    addSearchBox();
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

function addPublicTransportIcons() {
	if(overlay) {
		overlay.setMap(null);
		overlay = new google.maps.OverlayView();
	}
	overlay.onRemove = function() {
		d3.selectAll("div.stations").remove();
	}
	
	overlay.onAdd = function() {
	      var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
	          .attr("class", "stations")
	         
	      // Draw each marker as a separate SVG element.
	      // We could use a single SVG, but what size would it have?
	      overlay.draw = function() {
	        var projection = this.getProjection(),
	            padding = 10;
	        var marker = layer.selectAll("svg")
	            .data(tableau)
	            .each(transform) // update existing markers
	          .enter().append("svg")
	            .each(transform)
	            .attr("class", "marker")
	            .attr("viewBox", "0 0 20 20")
	            .attr("id",function(d){
	              return d[1];
	            }).on("click", markerClick);
	            
	        marker.append("svg:image")
	            .attr("width", "100%")
	            .attr("height", "100%")
	            .attr("x", 0)
	            .attr("y", 0)
	            .attr("xlink:href",function(d){
	            	var products = d[1];
	            	if(products&1==1){
	            		return "";
	            	}
	            	if((products&2)==2){
	            		return "images/speed_train.jpg";
	            	}
	            	if((products&4)==4){
	            		return "images/train.png";
	            	}
	            	if((products&8)==8){
	            		return "images/rooftop.jpg";
	            	}
	            	if((products&16)==16){
	            		return "images/train.png";
	            	}
	            	if((products&32)==32){
	            		return "images/subway.png";
	            	}
	            	if((products&64)==64){
	            		return "images/tram.png";
	            	}
	            	if((products&128)==128){
	            		return "images/busstop.png";
	            	}	
	            	if((products&256)==256){
	            		return "images/ferry.png";
	            	}
	            	if((products&512)==512){
	            		return "images/taxi.png";
	            	}
	            });
	        
	        function transform(d) {
	        	console.log("d: " + d);
	        	console.log("d[0]: " + d[0]);

	            d = projection.fromLatLngToDivPixel(d[0]);
	                return d3.select(this)
	                		.style("left", (d.x - padding) + "px")
	                		.style("top", (d.y - padding) + "px");
	        	}
	      }
	     
	}
	overlay.setMap(map);
}

function markerClick(d) {
	console.log(this);
	console.log(d);
	console.log("test");
	var contentStringInitial ='Related Information';
	
	var infowindowinitial = new google.maps.InfoWindow({	// infowindow creation when cluster clicked first time
		content: contentStringInitial,		// dom object
		position: d[0]				// latLng object
	});

	infowindowinitial.open(map);
}