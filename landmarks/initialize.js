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
		distance: 1000000,
		name: "No landmarks nearby",
	}
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


		request.open("POST", "https://defense-in-derpth.herokuapp.com/sendLocation", true);
		userData = "login=O6VNCD83&lat=" + lat + "&lng=" + lng;
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				//if request is successful, save parsed json data in arrays 
				rawData = request.responseText;
				data = JSON.parse(rawData);
				people = data.people;
				landmarks = data.landmarks;
				var theirLatLng;
		        for(i = 0; i < people.length; i++) {
		        	if(people[i].lat != lat && people[i].lng != lng){
			        	markers[i] = {};
						markers[i] = new google.maps.Marker({
							position: new google.maps.LatLng(people[i].lat,people[i].lng),
							title: people[i].login,
							icon: personIcon
						});
						theirLatLng = new google.maps.LatLng(people[i].lat,people[i].lng);
						markers[i].setMap(map);
						distance = google.maps.geometry.spherical.computeDistanceBetween(loc, theirLatLng);
						var content = "<h4>" + markers[i].title + "</h4><body><p>Distance away: " + distance/1609.34 + " miles</p></body>";
						google.maps.event.addListener(markers[i], 'click', function() {
							infowindow.setContent(content);
							infowindow.open(map, this);
						});
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

					var details = landmarks[i].properties.Details;
					landmarkers[i].setMap(map);
					google.maps.event.addListener(landmarkers[i], 'click', function() {
						infowindow.setContent(details);
						infowindow.open(map, this);
					})

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


