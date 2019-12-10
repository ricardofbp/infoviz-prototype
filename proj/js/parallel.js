var data_parallel;

// Parse the Data
d3.csv("../dataset/parallel_dataset.csv").then(function(d) {
  data_parallel = d;
  renderParallel();
})

function renderParallel() {
  var width = 750;
  var height = 300;
  var padding = 20;

  var svg = d3.select("#parallelcoords")
  .append("svg")
    .attr("transform", "translate(0, " + 0 + ")")
    .attr("width", width)
    .attr("height", height)
  .append("g")


  // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called team
  dimensions = d3.keys(data_parallel[0]).filter(function(d) { return d != "team" && d != "season" && d != "attend/g"})

  // For each dimension, I build a linear scale. I store all in a y object
  var y = {}
  for (i in dimensions) {
    name = dimensions[i];
    if (name == "rank") {
      y[name] = d3.scaleLinear()
        .domain( d3.extent(data_parallel, function(d) { return +d[name]; }) )
        .range([padding, height-padding])
    }
    else {
      y[name] = d3.scaleLinear()
        .domain( d3.extent(data_parallel, function(d) { return +d[name]; }) )
        .range([height-padding, padding])
    }
  }

  // Build the X scale -> it find the best position for each Y axis
  x = d3.scalePoint()
    .range([0, width])
    .padding(1)
    .domain(dimensions);

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  dispatch_parallel.on("year", function() {
    updateLines();
  })

  dispatch_parallel.on("addTeam", function(team) {
    addLine(team);
  });

  dispatch_parallel.on("removeTeam", function(team) {
    removeLine(team);
  });

  var transitionDuration = 1000;

  function addLine(team) {
    var tag = team.replace(/[\s']+/g, ''); 

    var line = svg.selectAll("path.parallelPath." + tag);

    line
      .data(data_parallel
        .filter(function(d){ return d.season == season_filter; })
        .filter(function(d){ return d.team == team; })) 
      .enter().append("path")
      .attr("class", (d) => {
        return "parallelPath " + tag;
      })
      .attr("d",  path)
      .style("fill", "none")
      .style("stroke-width", 2)
      .style("stroke", (d) => {
        return teamColor(d.team, 1);
      })
      .style("opacity", 1);

  }

  function removeLine(team) {
    svg.selectAll("path.parallelPath." + team.replace(/[\s']+/g, ''))
        .transition().duration(transitionDuration)
        .style("opacity", 0)
    .remove()
  }

  function updateLines() {
    for (let i = 0; i < teamFilters.length; i++) {
      var tag = teamFilters[i].replace(/[\s']+/g, ''); 

      console.log(svg.selectAll("path.parallelPath." + tag));
      svg.selectAll("path.parallelPath." + tag)
        .data(data_parallel
          .filter(function(d){ return d.season == season_filter; })
          .filter(function(d){ return d.team == teamFilters[i]; })) 
        .transition().duration(transitionDuration)
        .attr("d",  path);

    }
  }
  
  // Draw the lines
  
  // Draw the axis:
  svg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    // And I build the axis with the call function
    .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
    // Add axis title
    .append("text")
      .style("text-anchor", "middle")
      .attr("transform", "translate(0, " + (padding) + ")")
      .attr("class", "p-label")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")
}