
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

  function createMap(data) {
    
    map = new mapboxgl.Map({
      container: "map-area", // container id
      style: "mapbox://styles/mapbox/dark-v10?optimize=true", // stylesheet location
      zoom: 1.3 // starting zoom
    });

    map.on("viewreset", render);
    map.on("move", render);
    map.on("moveend", render);


    d3.selectAll(".mapboxgl-canvas")
      .style("opacity", 0.9)
      .style("position", "absolute")
      .style("z-index", 1);
    return data;
  }

  function createDots(data) {
    var container = map.getCanvasContainer();

    var svg = d3.select(container).append("svg")
      .attr("width", "1000")
      .attr("height", "1800")
      .style("position", "absolute")
      .style("z-index", 10);

    let dots = svg.selectAll("circle")
      //.data(vis.locationData.features)
      .data(vis.airData.features)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("r", 2)
      .style("opacity", 0.5)
      .style("fill", "#ff3636");

    render();
  }


  // Project coordinates onto map
  function project(d) {
    return map.project(new mapboxgl.LngLat(d[0], d[1]));
  }

  //draw dots on map
  function render() {
    d3.selectAll(".circle")
      .attr("cx", function(d) {
        //return project(d.data).x;
        return project(d.geometry.coordinates).x;

      })
      .attr("cy", function(d) {
        //return project(d.data).y;
        return project(d.geometry.coordinates).y;
      });
  }

  createMap(vis.airData);
  createDots(vis.airData);

  vis.updateVis();

}


MapChart.prototype.updateVis = function() {
  var vis = this;



}
