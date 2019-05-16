//accessToken
mapboxgl.accessToken = 'pk.eyJ1IjoianozMzA5IiwiYSI6ImNqbGR4amJwMjBnODkza3V2ZzFxMHV0dW0ifQ.lQd9gMzBwlRC_TikwmZTbQ';

//add basemap and set center point
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [-111.905834, 40.670030],
  zoom: 14.5
});

//add directions
map.addControl(new MapboxDirections({
  accessToken: mapboxgl.accessToken
}), 'top-right');

//add NavigationControl
map.addControl(new mapboxgl.NavigationControl());


//add circle
map.on('load', function() {
  //add source
  map.addSource('pointssource', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/jz3309/ADS/master/avgfee.geojson'
  });

  //add label
  map.addLayer({
    id: "poi-labels",
    type: "symbol",
    source: "pointssource",
    layout: {
      "text-field": ["get", "Address"],
      "text-font": ["Lato Black"],
      "text-offset": [0, 1.5],
      "text-size": 8,
      "text-allow-overlap": true,
      "text-justify": "center",
      "icon-offset": [0, -22],
      "icon-image": "marker",
      "icon-allow-overlap": true
    },
    paint: {
      "text-color": "#fff"
    }
  });

  //load  all the itmes to console
  map.addLayer({
    id: 'stationpoints',
    type: 'circle',
    source: 'pointssource',
    paint: {
      // make circles larger as the user zooms from z12 to z22
      //circle-radius': {
      //'base': 5,
      //'stops': [[10.5, 5], [16, 20]]
      //color circles by city
      'circle-stroke-width': 5,
      'circle-stroke-color': '#f7df26',
      'circle-color': "#f7df26",
      'circle-stroke-opacity': 0.1,
      'circle-radius': {
        'base': 0.8,
        'stops': [
          [13.5, 2.5],
          [17, 10]
        ]
      }
    },

  });
});

//add popup when hover to show the address and price for each station
var popup = new mapboxgl.Popup({});

map.on('mouseenter', 'stationpoints', function(e) {
  map.getCanvas().style.cursor = 'pointer';

  var coordinates = e.features[0].geometry.coordinates.slice();
  var description = e.features[0].properties.StationName;
  var prices = e.features[0].properties.AvgTestFees;
  var phonenumber = e.features[0].properties.PhoneNumber
  var address = e.features[0].properties.Address
  var zip = e.features[0].properties.ZIP
  var city = e.features[0].properties.City



  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  popup.setLngLat(coordinates)
    .setHTML('<h4>' + description + '</h4>' + '</br>' + '<h7>' + 'Price: $' + prices + '</h7>' + '</br><h7>' + 'Phone Number: ' + phonenumber + '</h7>' +
      '</br><h7>' + 'Address: ' + address + '</h7>' + '</br><h7>' + 'ZipCode: ' + zip + '</h7>')
    .addTo(map);

});

map.on('mouseleave', 'stationpoints', function() {
  map.getCanvas().style.cursor = '';
});


document.getElementById('slider').addEventListener('input', function(e) {
  var fee = parseInt(e.target.value);
  // update the map
  map.setFilter('stationpoints', ['<', ['number', ['get', 'AvgTestFees']], fee]);

  // update text in the UI
  document.getElementById('fee-filter').innerText = fee
});
