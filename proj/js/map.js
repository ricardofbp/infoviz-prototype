var svg_map;
var data_map;

renderMap();

function renderMap() {
  
var width = 800;
var mapRatio = 0.45;
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

  var marks = [{
        lat: 36.778259,
        long: -119.417931
      }];

  var logoWidth = 30;
  var logoHeight = 30;
  svg.selectAll(".mark")
    .data(teamColors)
    .enter()
    .append("image")
    .attr('class', (d) => {
      return 'mark ' +  d.team.replace(/\s+/g, '');
    })
    //the x and y centers the logos on the center of the state
    .attr("x", -logoWidth/2)
    .attr("y", -logoHeight/2)
    .attr('width', logoWidth)
    .attr('height', logoHeight)
    .attr("xlink:href", (d) => {
      return "logos/" + d.team.replace(/\s+/g, '') + ".png";
    })
    .attr("transform", (d) => {
      return "translate(" + projection([d.long, d.lat]) + ")";
    })
    .on("click", (d) => {
      if (changeTeams(d.team)) {
        svg.select(".mark." + d.team.replace(/\s+/g, ''))
          .style("outline",  "1px solid gray");
      }
      else {
        svg.select(".mark." + d.team.replace(/\s+/g, ''))
          .style("outline",  "0px solid gray");
      }
    })
    .on("mouseover", (d) => {
      svg.select(".mark." + d.team.replace(/\s+/g, ''))
          .attr("x", -(logoWidth + 20)/2)
          .attr("y", -(logoHeight + 20)/2)
          .attr('width', logoWidth + 20)
          .attr('height', logoHeight + 20);
    })
    .on("mouseleave", (d) => {
      svg.select(".mark." + d.team.replace(/\s+/g, ''))
          .attr("x", -logoWidth/2)
          .attr("y", -logoHeight/2)
          .attr('width', logoWidth)
          .attr('height', logoHeight);
    })

  
  console.log(svg);
});

}