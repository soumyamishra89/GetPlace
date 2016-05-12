/**
 * 
 */

var map, loc, radius = 500, overlay, infowindowinitial, layer, projection, searchPlaceId, placeCountMap = new Map(),
padding = 10, placeTypeClass = 0;

//var placesToSearch= ['publicTransport', 'grocery_or_supermarket', 'shopping_mall', 'restaurant', 'hospital', 'park', 'school', 'gym'];
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
 * Loads the places with their icons as per the points of interest specified by the user
 */
function loadPlaces() {
    request['location'] = map.getCenter();
    recreateOverlay();
    placeCountMap = new Map();
    placeTypeClass = 0;
	for(var i = 0, criteria; criteria = placesToSearch[i]; i++) {
		switch(criteria) {
			case 'publicTransport' :
					var xhttp = new XMLHttpRequest();
					var nearbyStopsURL = [];
					nearbyStopsURL.push("https://api.resrobot.se/location.nearbystops?key=0eab2bb0-a7dc-420e-9385-eda6641ad913");
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
					   		var transportData = [];
					   		if(stopsInfo && stopsInfo.StopLocation) {
						   		for(var i=0, stopLoc;stopLoc=stopsInfo.StopLocation[i];i++) {
						   			transportData.push([new google.maps.LatLng(stopLoc.lat, stopLoc.lon), 'publicTransport', stopLoc.products, stopLoc.name]);
						   		}
						   		addPlaceIcons(transportData, 'publicTransport');
						   		placeCountMap.set('publicTransport', transportData.length);
						    }
					   	}
					    	
					  }
			
					}; 
					break;
					
				default: request['type']=criteria;
						placeCountMap.set(criteria, 0);
						nearbySearch(criteria);
					  	break;
		}
	}
}
	
// callback called when the map is loaded
function initMap() {
	loc = new google.maps.LatLng(59.333344, 18.056963999999994);
	// adding location of search for request to place search
	   var styles = [
	                 {
	                     "featureType": "poi",
	                     "stylers": [{ "visibility": "off" }]
	                 },
	                 {
	                	 "featureType": "transit.station",
	                	 "stylers": [{ "visibility": "off"}]
	                 }
	                 ];
	map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: loc,
    mapTypeId: google.maps.MapTypeId.MAP
  });
	 map.setOptions({ styles: styles });
	// once a map has been created, a searchbox to search for places is attached to it. check googlesearch.js
	
    addSearchBox();
}

/**
 * adds the traveltime widget to the google map
 */
function showTravelTimeMap(){
   var originPoint = map.getCenter().lat()+','+ map.getCenter().lng();
   var widget = new walkscore.TravelTimeWidget({
    	  map    : map,
    	  origin : originPoint,
    	  show   : true,
    	  mode   : walkscore.TravelTime.Mode.DRIVE,
    	  time : 10
    	});
  }

/**
 * creates a new overlay for each search and removes the old one
 */
function recreateOverlay(data) {
	if(overlay) {
		overlay.setMap(null);
		overlay = new google.maps.OverlayView();
	} else {
		overlay = new google.maps.OverlayView();
	}
	
	overlay.onRemove = function() {
		d3.selectAll("div.stations").remove();
		layer = null;
		projection = null;
	}
	
	overlay.onAdd = function() {
	       layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
	          .attr("class", "stations");
	   // Draw each marker as a separate SVG element.
	      // We could use a single SVG, but what size would it have?
	      overlay.draw = function() {
	         projection = this.getProjection();
	        
	         layer.selectAll("svg").each(transform);	     
	      }
	}
	
	overlay.setMap(map);
}
/**
 * adds icons pertaining to places of interest
 */
function addPlaceIcons(data, placeType) {
	
    var marker = layer.selectAll("svg."+placeType)
        .data(data)
        .each(transform) // update existing markers
      .enter().append("svg")
        .each(transform)
        //.attr("class", "marker")
        .attr("class", placeType)
        .attr("viewBox", "0 0 20 20")
        .on("click", placeClick);
        
    marker.append("svg:image")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("x", 0)
        .attr("y", 0)
        .attr("xlink:href",function(d) {
        	var placeOfInterest = d[1];
        	switch(placeOfInterest) {
        	case 'publicTransport': var products = d[2];
            	var transportCount = 0;
            	if(products&1==1) {
            		transportCount++;
            	}
            	if((products&2)==2) {
            		transportCount++;
            	}
            	if((products&4)==4) {
            		transportCount++;
            	}
            	if((products&8)==8) {
            		transportCount++;
            	}
            	if((products&16)==16) {
            		transportCount++;
            	}
            	if((products&32)==32) {
            		transportCount++;
            	}
            	if((products&64)==64) {
            		transportCount++;
            	}
            	if((products&128)==128) {
            		transportCount++;
            	}	
            	if((products&256)==256) {
            		transportCount++;
            	}
            	if((products&512)==512) {
            		transportCount++;
            	}
            	
            	if(transportCount>1) {
            		return "images/public_transport.png";
            	} else {
            		switch(products) {
            		case 1: return "images/flight.png";
            		case 2: return "images/speed_train.jpg";
            		case 4: return "images/train.png";
            		case 8: return "images/expressbus.png";
            		case 16: return "images/train.png";
            		case 32: return "images/subway.png";
            		case 64: return "images/tram.png";
            		case 128: return "images/busstop.png";
            		case 256: return "images/ferry.png";
            		case 512: return "images/taxi.png";
            		}
            	}
            	break;
            default: return "images/"+placeOfInterest+".png";
            }
        });
}

/**
 * 
 * @param d data containing lat long info
 * @returns d3 transformation
 */
function transform(d) {
    d = projection.fromLatLngToDivPixel(d[0]);
    return d3.select(this)
        		.style("left", (d.x - padding) + "px")
        		.style("top", (d.y - padding) + "px");
	}

/**
 * click event attached to the place icon
 * @param d
 */
function placeClick(d) {
	if(infowindowinitial) {
		infowindowinitial.close();
	}
	var destination = d[0].lat()+","+d[0].lng();
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=place_id:" + searchPlaceId + "&destinations=" + destination + "&key=AIzaSyDh9Z6i4XAo_truUafZzfYKBLU60W54it8", true);
	//xhttp.setRequestHeader("Access-Control-Allow-Origin", "https://api.resrobot.se/location.nearbystops")
	xhttp.send();
	  
	xhttp.onreadystatechange = function() {
		
	  if (xhttp.readyState == 4 && xhttp.status == 200) {
		  var response = xhttp.responseText;
		  var distance = JSON.parse(response);
		  if(distance.status=="OK") {
			  for(var i=0, row; row = distance.rows[i]; i++) {
				  for(var j=0, element; element = row.elements[j]; j++) {
					 var distanceLabel = document.getElementById("distLbl");
					 if(distanceLabel) {
						 distanceLabel.innerHTML = element.distance.text;
					 }
				  }
			  }
		  }
	  }
	}
	var placeOfInterest = d[1];
	switch(placeOfInterest) {
		case 'publicTransport': 
	    
		var contentStringInitial = addTransportImageToInfoWindow(d, contentStringInitial);
		
		infowindowinitial = new google.maps.InfoWindow({	// infowindow creation when cluster clicked first time
			content: contentStringInitial,		// dom object
			position: d[0]				// latLng object
		});
		break;
		default:
			var contentStringInitial = '<div>'; 
			contentStringInitial+='<img src="images/' + d[1] + '.png" style="width:20px;height:20px;"/>';
			contentStringInitial+='<label id="distLbl"></label></div><br><b>'+d[2].trim()+'</b>';
			infowindowinitial = new google.maps.InfoWindow({	// infowindow creation when cluster clicked first time
			content: contentStringInitial,		// dom object
			position: d[0]				// latLng object
		});
		break;
	}
	infowindowinitial.open(map);
}

function addTransportImageToInfoWindow(d, contentStringInitial) {
	var products = d[2];
	var contentStringInitial = '<div>'; 
	if(products&1==1) {
		contentStringInitial+='<img src="images/flight.png" style="width:20px;height:20px;"/>';
	}
	if((products&2)==2) {
		contentStringInitial+='<img src="images/speed_train.jpg" style="width:20px;height:20px;"/>';
	}
	if((products&4)==4) {
		contentStringInitial+='<img src="images/train.png" style="width:20px;height:20px;"/>';
	}
	if((products&8)==8) {
		contentStringInitial+='<img src="images/expressbus.png" style="width:20px;height:20px;"/>';
	}
	if((products&16)==16) {
		contentStringInitial+='<img src="images/train.png" style="width:20px;height:20px;"/>';
	}
	if((products&32)==32) {
		contentStringInitial+='<img src="images/subway.png" style="width:20px;height:20px;"/>';
	}
	if((products&64)==64) {
		contentStringInitial+='<img src="images/tram.png" style="width:20px;height:20px;"/>';
	}
	if((products&128)==128) {
		contentStringInitial+='<img src="images/busstop.png" style="width:20px;height:20px;"/>';
	}	
	if((products&256)==256) {
		contentStringInitial+='<img src="images/ferry.png" style="width:20px;height:20px;"/>';
	}
	if((products&512)==512) {
		contentStringInitial+='<img src="images/taxi.png" style="width:20px;height:20px;"/>';
	}
	return contentStringInitial+='<label id="distLbl"></label></div><br><b>'+d[3].trim()+'</b>';
}

function nearbySearch(placeType){
  	service = new google.maps.places.PlacesService(map);
	
  	service.nearbySearch(request, function (results, status, pagination) {
  		extractPlaces(results, status, pagination, placeType);
  	});
}

/**
 * Extracts the lat long and other relevant information from google place search
 * @param results from google place search
 * @param status status of the search
 * @param pagination results divided into pages (max 3)
 * @param placeType the place of interest selected by user
 */
function extractPlaces(results, status, pagination, placeType) {
	console.log("extractPlaces");
	var placeData = [];
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		var weight = placesToSearch.length - placesToSearch.indexOf(placeType);
		for (var i = 0; i < results.length; i++) {
			var place = results[i];
			placeData.push([place.geometry.location, placeType, place.name]);
        }

		addPlaceIcons(placeData, placeType+(placeTypeClass++));
		placeCountMap.set(placeType, placeCountMap.get(placeType) + placeData.length);
		
		setLocationDetails(placeType, placeCountMap.get(placeType));
	}
  	
    if(pagination.hasNextPage) {
    	pagination.nextPage();
    }
}

function setLocationDetails(placeType, count) {
	switch(placeType) {
		case 'restaurant' :  
				$('#nearby_restaurant').show();
				document.getElementById('nearby_restaurant_count').innerHTML = count;
				if (count > 1) {
					document.getElementById('nearby_restaurant_count').innerHTML += " Restaurants";
				}else{
					document.getElementById('nearby_restaurant_count').innerHTML += " Restaurant"
				}
			    break;
		case 'shopping_mall' :  
				$('#nearby_shopping_mall').show();
				document.getElementById('nearby_shopping_mall_count').innerHTML = count;
				if (count > 1) {
					document.getElementById('nearby_shopping_mall_count').innerHTML += " Shopping Malls";
				}else{
					document.getElementById('nearby_shopping_mall_count').innerHTML += " Shopping Mall"
				}
			    break;
		case 'grocery_or_supermarket' :  
				$('#nearby_grocery_or_supermarket').show();
				document.getElementById('nearby_grocery_or_supermarket_count').innerHTML = count;
				if (count > 1) {
					document.getElementById('nearby_grocery_or_supermarket_count').innerHTML += " Gorcery Stores";
				}else{
					document.getElementById('nearby_grocery_or_supermarket_count').innerHTML += " Gorcery Store"
				}
			    break;
		case 'hospital' :  
				$('#nearby_hospital').show();
				document.getElementById('nearby_hospital_count').innerHTML = count;
				if (count > 1) {
					document.getElementById('nearby_hospital_count').innerHTML += " Hospitals";
				}else{
					document.getElementById('nearby_hospital_count').innerHTML += " Hospital"
				}
			    break;
		case 'gym' :  
				$('#nearby_gym').show();
				document.getElementById('nearby_gym_count').innerHTML = count;
				if (count > 1) {
					document.getElementById('nearby_gym_count').innerHTML += " Gyms";
				}else{
					document.getElementById('nearby_gym_count').innerHTML += " Gym"
				}
			    break;
		case 'school' :  
				$('#nearby_school').show();
				document.getElementById('nearby_school_count').innerHTML = count;
				if (count > 1) {
					document.getElementById('nearby_school_count').innerHTML += " Schools";
				}else{
					document.getElementById('nearby_school_count').innerHTML += " School"
				}
			    break;
		case 'park' :  
				$('#nearby_park').show();
				document.getElementById('nearby_park_count').innerHTML = count;
				if (count > 1) {
					document.getElementById('nearby_park_count').innerHTML += " Parks";
				}else{
					document.getElementById('nearby_park_count').innerHTML += " Park"
				}
			    break;
	}
}