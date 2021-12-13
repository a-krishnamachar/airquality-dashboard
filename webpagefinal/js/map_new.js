
function MapChart (_parentElement, _data, _airData) {
  this.parentElement = _parentElement;
  this.locationData = _data;
  this.airData = _airData;

  this.initVis();
}

MapChart.prototype.initVis = function() {
  mapboxgl.accessToken = "pk.eyJ1IjoiYWtyaXNobmFtYWNoYXIiLCJhIjoiY2t0N2RvemZzMHJiajJ2bzAzZjZ2amc2MyJ9.J6Yl9EbxdWKCi9dnnX70GA";
  var map;

  var vis = this;
  //console.log(vis.locationData);
  console.log(vis.airData);

    map = new mapboxgl.Map({
      container: "map-area", // container id
      style: "mapbox://styles/mapbox/dark-v10?optimize=true", // stylesheet location
      zoom: 1.5 // starting zoom
    });

    const coordinatesGeocoder = function (query) {
// Match anything which looks like
// decimal degrees coordinate pair.
  const matches = query.match(
    /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
    );
    if (!matches) {
      return null;
    }

function coordinateFeature(lng, lat) {
  return {
    center: [lng, lat],
    geometry: {
      type: 'Point',
      coordinates: [lng, lat]
    },
    place_name: 'Lat: ' + lat + ' Lng: ' + lng,
    place_type: ['coordinate'],
    properties: {},
    type: 'Feature'
  };
  }

const coord1 = Number(matches[1]);
const coord2 = Number(matches[2]);
const geocodes = [];

if (coord1 < -90 || coord1 > 90) {
// must be lng, lat
geocodes.push(coordinateFeature(coord1, coord2));
}

if (coord2 < -90 || coord2 > 90) {
// must be lat, lng
geocodes.push(coordinateFeature(coord2, coord1));
}

if (geocodes.length === 0) {
// else could be either lng, lat or lat, lng
geocodes.push(coordinateFeature(coord1, coord2));
geocodes.push(coordinateFeature(coord2, coord1));
}

return geocodes;
};

// Add the control to the map.
map.addControl(
new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
localGeocoder: coordinatesGeocoder,
zoom: 4,
placeholder: 'Type name OR lat, long',
mapboxgl: mapboxgl,
reverseGeocode: true
})
);

  map.on('load', () => {
    map.addSource('purpleair', {
      type: 'geojson',
      data: 'data/dataset_noTemp.geojson',
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
  });

    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'purpleair',
      filter: ['has', 'point_count'],
      paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#187ede', 100, '#a322bd', 750, '#510ec4'],
        // 'red', 100, 'blue', 750, 'white'],
        'circle-radius': ['step', ['get', 'point_count'],
        20, 100, 30, 750, 40]}
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'purpleair',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12}
      });

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'purpleair',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': 'red',
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });
      map.addLayer({
        id: "unclustered-text",
        type: "symbol",
        source: "purpleair",
        filter: ["has", "point_count"],
        layout: {
        // "text-field": 'hello',
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12}
      }, 'unclustered-point');

      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {layers: ['clusters']});
        const clusterId = features[0].properties.cluster_id;
        map.getSource('purpleair').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });

// When a click event occurs on a feature in
// the unclustered-point layer, open a popup at
// the location of the feature, with
// description HTML from its properties.
  map.on('click', 'unclustered-point', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    console.log(e.features[0].properties);
    var pmname = "pm_2.5";
    var pm_now = e.features[0].properties[pmname];
    var hourname = "1hour_avg";
    var houravg = e.features[0].properties[hourname];
    var locationname = e.features[0].properties['name'];

// Ensure that if the map is zoomed out such that
// multiple copies of the feature are visible, the
// popup appears over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  new mapboxgl.Popup()
  .setLngLat(coordinates)
  .setHTML(
    `${locationname}<br>
    Current: ${pm_now}<br>
    1-Hour Average: ${houravg}`
  )
    .addTo(map);
  });

  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
  });


  });

}

MapChart.prototype.updateVis = function() {
  var vis = this;

}
