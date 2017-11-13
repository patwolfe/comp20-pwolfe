	var request = new XMLHttpRequest(); 
	var lat = 0;
	var lng = 0; 
	var loc = new google.maps.LatLng(lat,lng);
	var options = {
		zoom: 13,
		center: loc,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var closestLandmark = {
		distance: 10000000000,
		name: "No landmarks nearby",
	};
    var map;
	var marker;
	var infowindow = new google.maps.InfoWindow();
	var people;
	var landmarks;
	var markers = [];
	var landmarkers = [];
	var personIcon = 'person.png';
	var landmarkIcon = 'castle.png';
	var yourIcon = 'youarehere.png';
	var myContent;

	function init()
	{
		map = new google.maps.Map(document.getElementById("map"), options); 
		getLocation();
	}

	function getLocation(){
		if (navigator.geolocation) {
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
		marker = new google.maps.Marker({
			position: loc,
			title: "Your Location",
			icon: yourIcon
		});
		marker.setMap(map);

		request.open("POST", "https://protected-oasis-56188.herokuapp.com/sendLocation", true);
		userData = "login=O6VNCD83&lat=" + lat + "&lng=" + lng;
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				rawData = request.responseText;
				data = JSON.parse(rawData);
				people = data.people;
				landmarks = data.landmarks;
				var theirLatLng;
		        for(i = 0; i < people.length; i++) {
		        	if(people[i].login != "O6VNCD83"){
			        	markers[i] = {};
						markers[i] = new google.maps.Marker({
							position: new google.maps.LatLng(people[i].lat,people[i].lng),
							title: people[i].login,
							icon: personIcon
						});
						markers[i].setMap(map);
						sentListenerPM(people[i], markers[i])
					}
				}
				for (i = 0; i < landmarks.length; i++) {
					landmarkers[i] = {};
					landmarkers[i] = new google.maps.Marker({
						position: new google.maps.LatLng(landmarks[i].geometry.coordinates[1], landmarks[i].geometry.coordinates[0]),
						title: landmarks[i].properties.Location_Name,
						icon: landmarkIcon
					});

					distance = google.maps.geometry.spherical.computeDistanceBetween(loc, landmarkers[i].position);

					if (distance < closestLandmark.distance) {
						closestLandmark.distance = distance;
						closestLandmark.name = landmarks[i].properties.Location_Name;
					    var polyLine = new google.maps.Polyline({
				          	path: [loc, landmarkers[i].position],
				          	geodesic: true,
				          	strokeColor: '#FF0000',
				          	strokeOpacity: 1.0,
				          	strokeWeight: 2
					    });
					    polyLine.setMap(map);
					}
					landmarkers[i].setMap(map);
					sentListenerLM(landmarks[i], landmarkers[i]);
				}
			}
 			myContent = "<body><p><b>Your Location</b></p><p> Closest Landmark is " + closestLandmark.name + "</p><p>" + closestLandmark.distance/1609.34 + " miles away</p></body>";

 			google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(myContent);
			infowindow.open(map, marker);
			})

		}
		request.send(userData); 

 		map.panTo(loc);
 		infowindow.setContent("O6VNCD83");
 		infowindow.open(map,marker);
	}

	function sentListenerLM(landmark, landmarker){
		var details = landmark.properties.Details;
		google.maps.event.addListener(landmarker, 'click', function() {
							infowindow.setContent(details);
							infowindow.open(map, this);
		})					
	}

	function sentListenerPM(person, marker){
		var theirLatLng = new google.maps.LatLng(person.lat, person.lng);
		distance = google.maps.geometry.spherical.computeDistanceBetween(loc, theirLatLng);
		var content = "<h4>" + marker.title + "</h4><body><p>Distance away: " + distance/1609.34 + " miles</p></body>";
		google.maps.event.addListener(marker, 'click', function() {
							infowindow.setContent(content);
							infowindow.open(map, this);
		})					
	}


