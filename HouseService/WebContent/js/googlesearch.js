/**
 * 
 */
var locationsearchBox, searchBox;
// gets triggered when the value in locationSearch box is changed
function enabledisableSearch() {
	var searchButton = document.getElementById('googlesearchButton');
	if(locationsearchBox.value === "" || placesToSearch.length===0)
		searchButton.disabled = true;
	else 
		searchButton.disabled = false;
}

function addSearchBox() {
	locationsearchBox = document.getElementById('locationSearch');
	searchBox = new google.maps.places.SearchBox(locationsearchBox);
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationsearchBox);

	// if a search place has been provided then it will be added to search box in this page
	if(window.location.search!=="") {
		decodeURI(window.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value){
			$('#locationSearch').val(value);
			console.log(locationsearchBox);
      document.getElementById('locationTitle').innerHTML = value;
		});
		locationsearchBox.oninput();
	}
  // Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
	 
	  var places = searchBox.getPlaces();
	    if (!places || places.length == 0) {
	      return;
	    }
	    
    // Clear out the old markers.
    markers.forEach(function(marker) {
       marker.setMap(null);
    });
    markers = [];

    // Hide all the location details
    $("#nearby_transport").hide();
    $("#nearby_restaurant").hide();
    $("#nearby_shopping_mall").hide();
    $("#nearby_grocery_or_supermarket").hide();
    $("#nearby_hospital").hide();
    $("#nearby_gym").hide();
    $("#nearby_school").hide();
    $("#nearby_park").hide();

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    
    places.forEach(function(place) {
    	searchPlaceId = place.place_id;
    	
    	var request = {
    			  placeId: place.place_id
    			};

    			service = new google.maps.places.PlacesService(map);
    			service.getDetails(request, callback);

    			function callback(place1, status) {
    			  if (status == google.maps.places.PlacesServiceStatus.OK) {
    			  }
    			}
        // change the location title in the right side bar
        document.getElementById('locationTitle').innerHTML = place.formatted_address;

        // open the right side bar
        $(".openSidebar").click();

        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

      // set inforwindow and marker
      var infowindow = new google.maps.InfoWindow({
        content: place.name
      });

      var marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name
      });

      marker.addListener('click', function() {
          infowindow.open(map, marker);
      });

      markers.push(marker);


      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
      
    map.setCenter(bounds.getCenter());
    
    showTravelTimeMap();
    recreateOverlay();
    
  });
}