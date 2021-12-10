

mapboxgl.accessToken = "pk.eyJ1IjoiYWtyaXNobmFtYWNoYXIiLCJhIjoiY2t0N2RvemZzMHJiajJ2bzAzZjZ2amc2MyJ9.J6Yl9EbxdWKCi9dnnX70GA";

var map;
//update this to pull in correct json data
const data = d3.json(
    "https://gist.githubusercontent.com/franksh/0a1dcf63a0976c78c1f7869a5abf9775/raw/c256896524926042d6d7091154c7523758d0480c/earthquakes.json",
    function(d) {
      return d;
    }
  )
  .then(createMap)
  .then(createPoints);

function createMap(data) {
  map = new mapboxgl.Map({
    container: "map-area", // container id
    style: "mapbox://styles/mapbox/light-v9", // stylesheet location
    zoom: 1.5 // starting zoom
  });

  map.on("viewreset", render);
  map.on("move", render);
  map.on("moveend", render);


  d3.selectAll(".mapboxgl-canvas")
    .style("opacity", 0.9)
    //.style("position", "absolute")
    .style("z-index", 1);
  return data;
}

function createPoints(data) {
  var container = map.getCanvasContainer();


  var svg = d3.select(container).append("svg")
  //var svg = d3.select("#map-area").append("svg")

    //.attr("viewBox", '0 0 500 500')
    .attr("width", "1000")
    .attr("height", "800")
    .style("position", "absolute")
    .style("z-index", 10);

  let dots = svg.selectAll("circle")
    .data(data.features)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("r", 5)
    .style("opacity", 0.7)
    .style("fill", "#ff3636");

  render();
}

//coordinates refactor
function project(d) {
  return map.project(new mapboxgl.LngLat(d[0], d[1]));
}

//redraw lines on top of map
function render() {
  d3.selectAll(".circle")
    .attr("cx", function(d) {
      return project(d.geometry.coordinates).x;
    })
    .attr("cy", function(d) {
      return project(d.geometry.coordinates).y;
    });
}
