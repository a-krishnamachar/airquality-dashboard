
function RadialChart (_parentElement, _data, _airData) {
  this.parentElement = _parentElement;
  this.locationData = _data;
  this.airData = _airData;
  //this.data = vis.data;
  //console.log(this.locationData);

  this.initVis();
}

RadialChart.prototype.initVis = function() {

  var radial;

  mapboxgl.accessToken = "pk.eyJ1IjoiYWtyaXNobmFtYWNoYXIiLCJhIjoiY2t0N2RvemZzMHJiajJ2bzAzZjZ2amc2MyJ9.J6Yl9EbxdWKCi9dnnX70GA";
  var vis = this;

  var margin = {top: 100, right: 0, bottom: 0, left: 0},
    width = 650 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom,
    innerRadius = 90,
    outerRadius = Math.min(width, height)/2;

  var svg = d3.select("#radial-chart").append("svg")
    .attr("viewBox", '0 0 800 800')

  // var svg = d3.select("#radial-chart").append("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom)


      .append("g")
        .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")");

  var x = d3.scaleBand()
        .range([0, 2 * Math.PI])
          .align(0)
          .domain(vis.locationData.map(function(d) { return d['name']; }));
  var y = d3.scaleRadial()
        .range([innerRadius, outerRadius])
        .domain([0, 600]);


  var colorScale = d3.scaleLinear()
    .domain([0,vis.locationData[0]['1hour_avg']])
    .range(["#a9cbdb", "#032738"])

    var radialpopup = d3.select("#radial-chart").append("div")
      .attr("id", "radialtooltip")
      .attr("class", "tooltip")
      .style("opacity", 0);

  //add bars to chart
  svg.append("g")
      .selectAll("path")
      .data(vis.locationData)
      .enter()
      .append("path")
              //change color based on AQI
        // .attr("fill", "#69b3a2")
        .attr("fill", function(d) {
          return colorScale(d['1week_avg']);
        })
        .attr("d", d3.arc()
          .innerRadius(innerRadius)
          .outerRadius(function(d) {
            return y(d['1week_avg']);
          })
          .startAngle(function(d) {
            return x(d['name']);
          })
          .endAngle(function(d) {
            return x(d['name']) + x.bandwidth();
          })
          .padAngle(0.02)
          .padRadius(innerRadius))
        .on('click', function(d,i) {
          //go to map area
          //copy coordinates
          var copyText = i['lat'] + ", " + i['lon'];
          navigator.clipboard.writeText(copyText)
          window.location.href="#map-overall-area"
        })
        .on('mouseover', function(d,i) {
          console.log('hello')
          d3.select(this)
            .attr("fill", "white")
          radialpopup.transition()
              .duration(150)
              .style("opacity", 0.8);
          radialpopup
              .html("7-day average AQI: " + i['1week_avg']
              + "<br/>" + "1-day avg: " + i['1day_avg']
              + "<br/>" + "Coordinates: " + i['lat'] + ", " + i['lon']
              + "<br/> -------------"
              + "<br/> CLICK to copy coordinates!");
        })
        .on("mouseout", function(d,i) {
          d3.select(this)
          .attr("fill", function(i) {
            return colorScale(i['1week_avg']);
          })
          radialpopup.transition().duration(500)
            .style("opacity", 0);
        });


    //location names
    svg.append("g")
        .selectAll("g")
        .data(vis.locationData)
        .enter()
        .append("g")
          .attr("text-anchor", function(d) { return (x(d['name']) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
          .attr("transform", function(d) { return "rotate(" + ((x(d['name']) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['1week_avg'])+10) + ",0)"; })
        .append("text")
          .text(function(d){ return(d['name'])})
          .attr("transform", function(d) { return (x(d['name']) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
          .style("font-size", "11px")
          .attr("alignment-baseline", "middle")


}

RadialChart.prototype.updateVis = function() {
  var vis = this;

}
