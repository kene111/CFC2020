function getMyCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  
  function showPosition(position) {
  
    var lati = position.coords.latitude;
    var longi = position.coords.longitude;
  
    
  
  function moveMapToCurrentLocation(map, latitude , longitude){
    map.setCenter({lat:latitude, lng:longitude});          //(current position = lat: 6.5568767999999995, lng:3.3456128) 
    map.setZoom(14);                                         // ( berlin = lat:52.5159, lng:13.3777)
                                                               // ( Nigeria = lat: 9.0820, lng:8.6753)
      
  }

  function addMarkersToMap(map, latitude , longitude) {
    var positionMarker = new H.map.Marker({lat:latitude, lng:longitude});
    map.addObject(positionMarker);

  }

  var platform = new H.service.Platform({ 
      apikey : '{FTea7OCJvTi_g6XV9L8xRkdhI7c4Upou2CTU3qP8Ymg}'
      
  });
  var defaultLayers = platform.createDefaultLayers();
  
  // This map is centered over africa
  var map = new H.Map(document.getElementById('map'),
    defaultLayers.vector.normal.map,{
    center: {lat:8.7832, lng:34.5085},                          //lat:8.7832, lng:34.5085   lat:50, lng:5
    zoom: 1, // this is what I am currently seeing.
    pixelRatio: window.devicePixelRatio || 1
  });
  
  // Enable the event system on the map instance:
  var mapEvents = new H.mapevents.MapEvents(map);
  
  // Instantiate the default behavior, providing the mapEvents object:
  new H.mapevents.Behavior(mapEvents);
    
  // add a resize listener to make sure that the map occupies the whole container
  window.addEventListener('resize', () => map.getViewPort().resize());
  
  
  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);
  
  // Now use the map as required...
  window.onload = function (map, lati, longi) {
    moveMapToCurrentLocation(map, lati, longi);
    addMarkersToMap(map, lati, longi);
  }
  
}
    
  // https://developer.here.com/documentation/examples/maps-js/maps/map-at-specified-location
  // https://www.javascripttutorial.net/javascript-return-multiple-values/
  // https://www.youtube.com/watch?v=iKWpK66Scyk

