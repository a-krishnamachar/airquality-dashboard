
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
// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
// with three steps to implement three types of circles:
//   * Blue, 20px circles when point count is less than 100
//   * Yellow, 30px circles when point count is between 100 and 750
//   * Pink, 40px circles when point count is greater than or equal to 750
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
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
