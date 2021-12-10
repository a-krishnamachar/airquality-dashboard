
function LollipopChart (_parentElement, _data, _airData) {
  this.parentElement = _parentElement;
  this.locationData = _data;
  this.airData = _airData;

  console.log(this.data);

  this.initVis();
}

LollipopChart.prototype.initVis = function() {
  var lollipop;

  mapboxgl.accessToken = "pk.eyJ1IjoiYWtyaXNobmFtYWNoYXIiLCJhIjoiY2t0N2RvemZzMHJiajJ2bzAzZjZ2amc2MyJ9.J6Yl9EbxdWKCi9dnnX70GA";
  var vis = this;

  var margin = {top: 10, right: 30, bottom: 40, left: 100},
    width = 460 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


  //get the top 500 worst AQIs



  var svg = d3.select("#lollipop-area")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear()
    .domain([0, 400])
    .range([ 0, width]);

console.log(vis.locationData.columns[2]);

  // var y = d3.scaleBand()
  //   .domain()
  //   .range([0, height])
  //   .padding(1);
  //   //update to pull in correct json data. for this we want only the top 50 AQIers.
  //   .domain(data.map(function(d) { return d.locationData.columns[]; }))
  //
  // svg.append("g")
  //   .call(d3.axisLeft(y))


  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");



  vis.updateVis();

}

LollipopChart.prototype.updateVis = function() {
  var vis = this;

}
