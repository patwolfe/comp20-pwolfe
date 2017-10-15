	console.log("starting javascript");
	var request = new XMLHttpRequest(); 
	var lat = 0;
	var lng = 0; 
	var loc = new google.maps.LatLng(lat,lng);
	var options = {
		zoom: 13,
		center: loc,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
    var map;
	var marker;
	var infowindow = new google.maps.InfoWindow();

	function init()
	{
		console.log("init map");
		map = new google.maps.Map(document.getElementById("map"), options); 
        console.log(map)
		getLocation();
	}

	function getLocation(){
		console.log("Getting Location");
		if (navigator.geolocation) {
            console.log("got location");
			navigator.geolocation.getCurrentPosition(function(position) {
				lat = position.coords.latitude;
				lng = position.coords.longitude; 
				renderMap(); 
			});
		}
		else {
			alert("The browser you are currently using does not support geolocation");
		}
	}

	function renderMap(){
		loc = new google.maps.LatLng(lat, lng);

        map.panTo(loc);

        console.log("rendering map with location" + loc);
        console.log(map);

		marker = new google.maps.Marker({
			position: loc,
			title: "Your Location"
		});
		marker.setMap(map);

		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(marker.title);
			infowindow.open(map, marker);
		})
	}