mapboxgl.accessToken = "pk.eyJ1IjoiYWtyaXNobmFtYWNoYXIiLCJhIjoiY2t0N2RvemZzMHJiajJ2bzAzZjZ2amc2MyJ9.J6Yl9EbxdWKCi9dnnX70GA";

var map;
var lollipop;
var lollipop_worldwide;
var lollipop_domestic;
var radial;
var height, width;

    loadData();
    function loadData() {
        d3.json("data/dataset_with10min.geojson").then(function(jsonData) {
          d3.csv("data/worstcurrentaqi.csv").then(function(mapData) {
            d3.csv("data/lastweekworst100.csv").then(function(radData) {
              d3.csv("data/weeklyUSworst100.csv").then(function(usweeklyData) {
                d3.csv("data/currentUSworst50.csv").then(function(uscurrentData) {

          //airdata is for the map!! geojson
          airData = jsonData;
          //visdata is for the chart, json
          visData = mapData;

          //raddata is for radial data
          radialData = radData;
          //console.log(airData);
          //console.log(visData);

          visAreas(visData, airData);
          visRadial(radialData, usweeklyData);
          visLollipop(visData, uscurrentData);
                })
              })
            })
          })
    });

    function visAreas(visData, airData) {
      map = new MapChart("map-area",visData, airData);
      lollipop_worldwide = new LollipopWorldwideChart("lollipop-area", visData, airData);
      // lollipop_domestic = new LollipopDomesticChart("lollipop-area-2", visData, airData);
      //radial = new RadialChart("radial-chart", visData, airData);

      misc();

    }
    function visLollipop(visData, uscurrentData) {
      lollipop_domestic = new LollipopDomesticChart("lollipop-area-2", visData, uscurrentData);

    }
    function visRadial(radialData, usweeklyData) {
      radial = new RadialChart("radial-chart", radialData, usweeklyData);
    }

    //worst AQI past 7 days?
    function misc() {
      $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
      });



    }



  }
