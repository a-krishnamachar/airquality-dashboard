
function LollipopDomesticChart (_parentElement, _data, _uscurrentData) {
  this.parentElement = _parentElement;
  this.worldData = _data;
  this.locationData = _uscurrentData;
  //this.data = vis.data;
  //console.log(this.data);

  this.initVis();
}

LollipopDomesticChart.prototype.initVis = function() {
  var lollipop;

  mapboxgl.accessToken = "pk.eyJ1IjoiYWtyaXNobmFtYWNoYXIiLCJhIjoiY2t0N2RvemZzMHJiajJ2bzAzZjZ2amc2MyJ9.J6Yl9EbxdWKCi9dnnX70GA";
  var vis = this;

  var margin = {top: 10, right: 30, bottom: 40, left: 100},
    width = 500 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;



  var svg = d3.select("#lollipop-area-2").append("svg")
    .attr("viewBox", '0 0 600 900')


// var svg = d3.select("#lollipop-area-2").append("svg")
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

console.log(vis.locationData.columns[2]);

  var y = d3.scaleBand()
    .range([0, height])
    .domain(vis.locationData.map(function(d) { return d['name']; }))
    .padding(1);
    //update to pull in correct json data. for this we want only the top 50 AQIers.
  svg.append("g")
      .call(d3.axisLeft(y))

    var colorScale = d3.scaleLinear()
      .domain([vis.locationData[49]['1hour_avg'],vis.locationData[0]['1hour_avg']])
      .range(["#a9cbdb", "#032738"])

      var lollipopdomesticpopup = d3.select("#lollipop-area-2").append("div")
        .attr("class", "tooltip")
        .attr("id", "domestictooltip")
        .style("opacity", 0);



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
        .attr("r", "5")
        .attr("fill", function(d) {
          return colorScale(d['1hour_avg']);
        })
        .on('click', function(d,i) {
          //go to map area
          //copy coordinates
          var copyText = i['lat'] + ", " + i['lon'];
          navigator.clipboard.writeText(copyText)
          window.location.href="#map-overall-area"
        })
        .on("mouseover", function(d, i) {
          d3.select(this)
            .attr("fill", "black")
          lollipopdomesticpopup.transition()
            .duration(150)
            .style("opacity", 0.8);
          lollipopdomesticpopup
            .html("AQI right now: " + i['pm_2.5']
            + "<br/>" + "AQI 1-hr avg: " + i['1hour_avg']
            + "<br/>" + "Coordinates: " + i['lat'] + ", " + i['lon']
            + "<br/> -------------"
            + "<br/> Click to copy sensor coordinates");

        })
        .on("mouseout", function(d,i) {
          d3.select(this)
            .attr("fill", function(d,i) {
              return colorScale(d['1hour_avg']);
            })
          lollipopdomesticpopup.transition().duration(500)
            .style("opacity", 0);
        })
        //
        // .on('mouseover', function (d,i) {
        //   console.log("im here")
        //   svg.selectAll("#tooltip")
        //   .style("opacity", "1")
        //   .text(d['pm_2.5']);
        // })
        // .on('mouseout', function() {
        //   svg.select("#tooltip")
        //     .style("opacity", "0");
        // })

        .attr("stroke", "black");

    //transitions
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

LollipopDomesticChart.prototype.updateVis = function() {
  var vis = this;

}
