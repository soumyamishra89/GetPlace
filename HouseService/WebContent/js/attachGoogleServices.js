/**
 * 
 */
function attachGoogleSearch() {
	var input = document.getElementById('googlesearch');
	var googleSearchBox = new google.maps.places.SearchBox(input);
	var searchButton = document.getElementById('searchButton');
	searchButton.addEventListener("click", function() {
		window.location.assign("explore.html?searchplace="+input.value);
	});
}

function enabledisablesearch() {
	if(document.getElementById('googlesearch').value==="") {
		searchButton.disabled = true;
	} else {
		searchButton.disabled = false;
	}
}
