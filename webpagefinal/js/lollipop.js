
function LollipopChart (_parentElement, _data, _airData) {
  this.parentElement = _parentElement;
  this.locationData = _data;
  this.airData = _airData;
  //this.data = vis.data;
  //console.log(this.data);

  this.initVis();
}

LollipopChart.prototype.initVis = function() {
  var lollipop;

  mapboxgl.accessToken = "pk.eyJ1IjoiYWtyaXNobmFtYWNoYXIiLCJhIjoiY2t0N2RvemZzMHJiajJ2bzAzZjZ2amc2MyJ9.J6Yl9EbxdWKCi9dnnX70GA";
  var vis = this;

  var margin = {top: 10, right: 30, bottom: 40, left: 100},
    width = 500 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

  var svg = d3.select("#lollipop-area").append("svg")
    .attr("viewBox", '0 0 630 900')

  // var svg = d3.select("#lollipop-area").append("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom)

      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear()
    .domain([0, vis.locationData[0]['1hour_avg'] + 20])
    .range([ 0, width]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

console.log(vis.locationData);

  var y = d3.scaleBand()
    .range([0, height])
    .padding(1)
    //update to pull in correct json data. for this we want only the top 50 AQIers.
    .domain(vis.locationData.map(function(d) { return d['name']; }));

    var colorScale = d3.scaleLinear()
      .domain([vis.locationData[49]['1hour_avg'],vis.locationData[0]['1hour_avg']])
      .range(["#a9cbdb", "#032738"])


  svg.append("g")
    .call(d3.axisLeft(y))

    svg.selectAll("myline")
      .data(vis.locationData)
      .enter()
      .append("line")
        .attr("x1", x(0))
        //.attr("x1", function(d) { return x(d['1hour_avg']); })
        .attr("x2", x(0))
        .attr("y1", function(d) { return y(d['name']); })
        .attr("y2", function(d) { return y(d['name']); })
        .attr("stroke", "grey")


    svg.selectAll("mycircle")
      .data(vis.locationData)
      .enter()
      .append("circle")
        .attr("cx", x(0))
        // .attr("cx", function(d) { return x(d['1hour_avg']); })
        .attr("cy", function(d) { return y(d['name']); })
        .attr("r", "4")
        // .style("fill", "#69b3a2")
        .attr("fill", function(d) {
          return colorScale(d['1hour_avg']);
        })
        .attr("stroke", "black");

      // Change the X coordinates of line and circle
    svg.selectAll("circle")
      .transition()
      .duration(3000)
      .attr("cx", function(d) { return x(d['1hour_avg']); })

    svg.selectAll("line")
    .transition()
    .duration(3000)
    .attr("x1", function(d) { return x(d['1hour_avg']); })

    //add hover on points to popup location and points


  vis.updateVis();

}

LollipopChart.prototype.updateVis = function() {
  var vis = this;

}
