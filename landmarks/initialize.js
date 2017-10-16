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
	var people;
	var landmarks;
	var markers = [];


	function init()
	{
		console.log("init map");
		map = new google.maps.Map(document.getElementById("map"), options); 
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

		request.open("POST", "https://defense-in-derpth.herokuapp.com/sendLocation", true);
		userData = "login=O6VNCD83&lat=" + lat + "&lng=" + lng;
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				//if request is successful, save parsed json data in arrays 
				rawData = request.responseText;
				data = JSON.parse(rawData);
				people = data.people;
				console.log(data.people);
				landmarks = data.landmarks;
				console.log(people);
				console.log(landmarks);


		        for(i = 0; i < people.length; i++) {
		        	if(people[i].lat != lat && people[i].lng != lng){
			        	markers[i] = {};
						markers[i] = new google.maps.Marker({
							position: new google.maps.LatLng(people[i].lat,people[i].lng),
							title: people[i].login
						});
						markers[i].setMap(map);
						google.maps.event.addListener(markers[i], 'click', function() {
						infowindow.setContent(markers[i].title);
						infowindow.open(map, markers[i]);
				})
					}
				}
			}
		}


		request.send(userData); 

 		map.panTo(loc);

	}
