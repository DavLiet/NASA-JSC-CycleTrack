        var firebaseRef = firebase.database().ref().child("Location"); //initializes the reference to our database
        
        //reference to the root/node that we want to retrieve data from
       
        
        var holder; 
        var pastLocations = [];

        
      var rootRef= firebase.database().ref(); 

        

    
             
       
     
                          
                          
                          
                          


        

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
             
             
            var heatmap = new google.maps.visualization.HeatmapLayer({
                data: pastLocations,  //array of everything
                map: map,
                radius: 16
                });

             
            }
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////
         function toggleHeatmap() {
        heatmap.setMap(heatmap.getMap() ? null : map);
         }

        function changeGradient() {
        var gradient = [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ]
        heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
      }

        function changeRadius() {
        heatmap.set('radius', heatmap.get('radius') ? null : 20);
      }

        
      function changeOpacity() {
       alert(pastLocations.length);
          firebaseRef.on("child_added", snap =>{
                    var latitu = snap.child("Latitude").val();
                    var longitu = snap.child("Longitude").val();
                    var dataLocate = new google.maps.LatLng(latitu,longitu);
                    testMarker(dataLocate);
                    pastLocations.push(dataLocate);
             
                     
                    
              
              
              
                });
          
      }
        
        



        function addMarker(location) {
            var marker = new google.maps.Marker({
            position: location,
            map: map
            });
            
            markersArray.push(marker);
            marker.setMap(map);
            
        }
        
        function testMarker(location){
            var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.BOUNCE,
            position: location
            });
            marker.setMap(map);
        }

        
        
        
        var index = 0;
        
        function placeMarker(){
            
            
            var deviceID = "2c004b001751353338363036";
            var accessToken = "68c164f729c13122277d216c4dd273d1423005d9";
            var eventSource = new EventSource("https://api.spark.io/v1/devices/" + deviceID + "/events/?access_token=" + accessToken);
            
            eventSource.addEventListener('Uptime', function(e) {
                 var rawData = JSON.parse(e.data);
                 var parsedData = JSON.parse(rawData.data);
                
                 currentLat = parsedData.Latitude;
                 currentLong = parsedData.Longitude;
                
                
            
               
                   
                
                
                
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
            
            
            
            
            
                index++;
                firebaseRef.child("Bookmark").update({
                    Place: index
                });
                firebaseRef.child(index).set({
                    Latitude: currentLat,
                    Longitude: currentLong
                });
                
                
            
            
            var centralPark = new google.maps.LatLng(currentLat,currentLong);
            addMarker(centralPark);
        }



        
        
        
        
        window.setInterval(function(){
          placeMarker();
         }, 5000);
        
        