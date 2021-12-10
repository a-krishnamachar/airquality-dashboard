mapboxgl.accessToken = "pk.eyJ1IjoiYWtyaXNobmFtYWNoYXIiLCJhIjoiY2t0N2RvemZzMHJiajJ2bzAzZjZ2amc2MyJ9.J6Yl9EbxdWKCi9dnnX70GA";

var map;
var lollipop;
var height, width;

    loadData();
    function loadData() {
        d3.json("data/dataset_with10min.geojson").then(function(jsonData) {
          d3.json("data/worstcurrentAQI.json").then(function(mapData) {

          //airdata is for the map!! geojson
          airData = jsonData;
          //visdata is for the chart, json
          visData = mapData;
          console.log(airData);
          console.log(visData);
          visAreas(visData, airData);
          })
    });

    function visAreas(visData, airData) {
      map = new MapChart("map-area",visData, airData);
      lollipop = new LollipopChart("lollipop-area", visData, airData);
    }


    //create table for worst AQI
    function createTable(data, columns) {
      var table = d3.select('body').append('table')
      var tableHead = table.append('thead')
      var	tableBody = table.append('tbody');

      tableHead.append('tr')
	      .selectAll('th')
	      .data(columns).enter()
	       .append('th')
	      .text(function (column) { return column; });

        var rows = tableBody.selectAll('tr')
    	    .data(data)
    	    .enter()
    	    .append('tr');

          var cells = rows.selectAll('td')
	         .data(function (row) {
	            return columns.map(function (column) {

              return {column: column, value: row[column]};
	           });
	        })
	        .enter()
	        .append('td')
	        .text(function (d) { return d.value; });

        return table;
    }

    // createTable(data, ['location', 'AQI']);
    // createTable(data, ['location']);
    // createTable(data, ['AQI']);


    //worst AQI past 7 days?




  }
