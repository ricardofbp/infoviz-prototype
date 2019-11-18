var scatterplotVarX = "ppg";
var data;

var team_filter = "Atlanta Hawks";
var season_filter = 2000;

d3.csv("../dataset/all_player_stats.csv", function(d) {
  return {
    name: d.name,
    season: +d.season,
    team: d.team,
    salary: +d.salary,
    ppg: +d.ppg,
    ppm: +d.ppm
  };

}).then(function(d) {
  data = d;
  render();
  console.log("linha1: " + d[0].name);
  console.log("name: " + d.name);
});


function render() {
  // Add X axis
  var w = 600;
  var h = 300;

  var padding = 30;

  var bar_w = Math.floor((w-padding*2)/data.length)-1;

  var xscale = d3.scaleLinear()
          //.domain([0,d3.max(data, function(d) {return d.ppg;})])
          .domain([0, 32])
          .range([padding,w-padding]);

  var hscale = d3.scaleLinear()
          .domain([0,d3.max(data, function(d) { return d.salary;}) / 10000])
          .range([h-padding,padding]);

  var r = 3;

  var svg = d3.select("#scatterplot")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

  var yaxis = d3.axisLeft()
          .scale(hscale);
  //console.log("max ppg: " + d3.max(data, function(d) {return d.ppg;}));
  var xaxis = d3.axisBottom()
          .scale(d3.scaleLinear()
            //.domain([0, d3.max(data, function(d) {return d.ppg;})])
            .domain([0, 32])
            .range([padding+bar_w/2,w-padding-bar_w/2]))
          //.tickFormat(d3.format("d"))
          //.ticks(data.length/4);

  svg.append("g")
     .attr("transform","translate(0," + (h-padding) + ")")
     .call(xaxis);

  svg.append("g")
    .attr("transform", "translate(30,0)")
    .call(yaxis);

var tooltip = d3.select("#scatterplot")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")



  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  var mousemove = function(d) {
    tooltip
      .html("Player: " + d.name + "<br>PPG: " + d.ppg + "<br>Salary: $" + d.salary)
      .style("left", (d3.mouse(this)[0]+5) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  svg.selectAll("circle")
    .data(data                
        .filter(function(d){ return d.season == season_filter; })
        .filter(function(d){ return d.team == team_filter; }))
    .enter().append("circle")
        .attr("r", r)
        .attr("fill", "rgba(128, 0, 128, 0.5)")
        .attr("cx", function(d, i){
        //console.log(xscale("xscale ppg: " + d.ppg));
            if (d.ppg == 0) {return padding;}
            return xscale(d.ppg);
        })
        .attr("cy", function(d) {
            return hscale(d.salary/10000);
        })
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )
      //.append("title")
      //  .text(function(d) { return d.player;});


    d3.selectAll(".team")
      .on("click", function() { //clickevent

          svg.selectAll("circle")
            .data(data                
                .filter(function(d){ return d.season == season_filter; })
                .filter(function(d){ return d.team == team_filter; }))//.transition().duration(1000)
                .attr("r", r)
                .attr("fill", "rgba(128, 0, 128, 0.5)")
                .attr("cx", function(d, i){
                //console.log(xscale("xscale ppg: " + d.ppg));
                    if (d.ppg == 0) {return padding;}
                    return xscale(d.ppg);
                })
                .attr("cy", function(d) {
                    return hscale(d.salary/10000);
                })
                .on("mouseover", mouseover )
                .on("mousemove", mousemove )
                .on("mouseleave", mouseleave )
        
    })
}