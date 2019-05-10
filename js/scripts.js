
mapboxgl.accessToken = 'pk.eyJ1IjoianozMzA5IiwiYSI6ImNqbGR4amJwMjBnODkza3V2ZzFxMHV0dW0ifQ.lQd9gMzBwlRC_TikwmZTbQ';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'https://api.mapbox.com/styles/v1/jz3309/cjvhavmbb0df11cn3eh8accga.html?fresh=true&title=true&access_token=pk.eyJ1IjoianozMzA5IiwiYSI6ImNqbGR4amJwMjBnODkza3V2ZzFxMHV0dW0ifQ.lQd9gMzBwlRC_TikwmZTbQ#10.0/42.362400/-71.020000/0',
  center: [-111.905834, 40.670030],
  zoom: 10.5
});

map.addControl(new mapboxgl.NavigationControl());

//add popup
map.on('click', function(e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['avgfeeforwebmap']
  });

  if (!features.length){
    return;
  }

  var feature = features[0];

  var popup = new mapboxgl.Popup({ offset:[0, -15]})
    .setLngLat([station.Lng, station.Lat])
    .setHTML('<h3>' + feature.Address + '</h3><p>' + feature.Price + '</p>')
    .addTo(map);
});
