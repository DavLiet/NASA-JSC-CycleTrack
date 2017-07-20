        var firebaseRef = firebase.database().ref(); //initializes the reference to our database
       


        var lat;
        var long;
        var currentDistance = 0;
        var pastLat;
        var pastLong;
        var currentLat;
        var currentLong;
        
        
     
            
        var latArray = [];
        var longArray=[];
        
       
        var markersArray = [];
        var map;
        var counter=1; //to keep track of arrays
        
        var start;
        var end;
        
        //////////////////////////////////////////////////////////////////////////////////////////////////
        
         function initMap() {    //initializes map at the center of JSC campus
            var myLatlng = new google.maps.LatLng(29.557720, -95.086797);  
            var myOptions = {
            zoom: 14,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            map = new google.maps.Map(document.getElementById("map"), myOptions);
             
            }
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        
        
        
        function addMarker(location) {
       var marker = new google.maps.Marker({
            position: location,
            map: map
        });
            
            markersArray.push(marker);
            marker.setMap(map);
            
          
        }
        
        function getDistance(start,end){
            
            var service = new google.maps.DistanceMatrixService;
            
            service.getDistanceMatrix({
                    origins: [start],
                    destinations: [end],
                    travelMode: 'WALKING',
                    unitSystem: google.maps.UnitSystem.METRIC,
                    avoidHighways: false,
                    avoidTolls: false
                    }, function(response, status) {
                        if (status !== 'OK') {
                        alert('Error was: ' + status);
                        } else {
                        var distance = response.rows[0].elements[0].distance;
                        var distance_value = distance.value;
                        currentDistance += distance.text;  //adds to total distance traveled
                            alert("Boi");
           

            

          }
        });
            
        }
        
        
        
        function placeMarker(){
            
            
            var deviceID = "2c004b001751353338363036";
            var accessToken = "68c164f729c13122277d216c4dd273d1423005d9";
            var eventSource = new EventSource("https://api.spark.io/v1/devices/" + deviceID + "/events/?access_token=" + accessToken);
            
            eventSource.addEventListener('Uptime', function(e) {
                 var rawData = JSON.parse(e.data);
                 var parsedData = JSON.parse(rawData.data);
                
                 currentLat = parsedData.Latitude;
                 currentLong = parsedData.Longitude;
                firebaseRef.push().set(currentLat + "," + currentLong);
                
                   
                
                
                
                //alert(currentLat);
            
             var origin1 = {lat: currentLat, lng: currentLong};
        //var origin2 = 'Greenwich, England';
        //var destinationA = 'Stockholm, Sweden';
        var destinationB = {lat: pastLat, lng: pastLong};
                
            

        
        var service = new google.maps.DistanceMatrixService;
        service.getDistanceMatrix({
          origins: [origin1],
          destinations: [destinationB],
          travelMode: 'BICYCLING',
          unitSystem: google.maps.UnitSystem.IMPERIAL,
          avoidHighways: false,
          avoidTolls: false
        }, function(response, status) {
          if (status !== 'OK') {
            alert('Error was: ' + status);
          } else {
            var distance = response.rows[0].elements[0].distance;
            var distance_value = distance.value;
            var distance_text = distance.text;
            var integer = parseInt(distance_value);
           currentDistance += integer;

           // alert(currentDistance);
              document.getElementById("dist").innerHTML = currentDistance;
              
              

          }
        });
                    
              
            
                pastLat = currentLat;
                pastLong = currentLong;
                
                
                
                
                
                
        
                counter += 1; 
                 }, false);
            
            
            var centralPark = new google.maps.LatLng(currentLat,currentLong);
            addMarker(centralPark);
        }
        
        
        
        window.setInterval(function(){
          placeMarker();
         }, 15000);
        
        