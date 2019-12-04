var svg_map;
var data_map;

renderMap();

function renderMap() {
  
var width = 800;
var mapRatio = 0.5;
var height = width * mapRatio;

var svg = d3.select("#USMap")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


console.log(svg);

var unemployment = d3.map();

 var projection = d3.geoAlbersUsa().translate([width /2 , height / 2])
            .scale(width);


        var path = d3.geoPath()
            .projection(projection);
/*
var promises = [
    d3.csv("../dataset/radarchart_dataset.csv", function(d) { unemployment.set(d.id, +d.rate); })
]
Promise.all(promises).then(ready)
*/

d3.json("../dataset/us.json").then(function(us) {
            svg.append("g")
                .attr("id", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                .attr("d", path)
                .attr("class", "state")

            svg.append("path")
                .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
                .attr("id", "state-borders")
                .attr("d", path)
                .attr("fill", "none")
                .attr("stroke", "#fff")
                .attr("stroke-width", "1.2px");

  
  console.log(svg);
});

}