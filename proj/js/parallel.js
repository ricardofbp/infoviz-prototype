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


  // Extract the list of dimensions we want to keep in the plot
  dimensions = d3.keys(data_parallel[0]).filter(function(d) { return d != "team" && d != "season" && d != "attend/g"})

  // For each dimension, I build a linear scale. I store all in a y object
  var y = {}
  for (i in dimensions) {
    name = dimensions[i];
    if (name == "Rank") {
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

  console.log(y);
  // Build the X scale -> it find the best position for each Y axis
  x = d3.scalePoint()
    .range([0, width])
    .padding(1)
    .domain(dimensions);

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  function ampLine(team) {
    var tag = team.replace(/[\s']+/g, ''); 
    svg.selectAll(".parallelPath")
    .style("opacity", 0.3);

    svg.selectAll("path.parallelPath." + tag)
    .style("opacity", 1);
  }

  function deAmpLine(team) {
    svg.selectAll("path.parallelPath")
        .style("opacity", 1);
  }

  function ampCircle(team) {
    var tag = team.replace(/[\s']+/g, ''); 
    svg.selectAll("circle.parallelCircle")
    .style("opacity", 0.3);

    for (let i = 0; i < dimensions.length; i++){ 
      svg.selectAll("circle.parallelCircle." + tag +i)
        .style("opacity", 1);
    }
  }

  function deAmpCircle(team) {
    svg.selectAll("circle.parallelCircle")
        .style("opacity", 1);
  }


  dispatch_parallel.on("year", function() {
    updateLines();
    updateCircles();
  });

  dispatch_parallel.on("addTeam", function(team) {
    addLine(team);
    addCircles(team);
  });

  dispatch_parallel.on("removeTeam", function(team) {
    removeLine(team);
    removeCircles(team);
  });

  dispatch_parallel.on("ampTeam", function(team) {
    console.log("AMP LINE PARALLEL");
    ampLine(team);
    ampCircle(team);
  });

  dispatch_parallel.on("deAmpTeam", function(team) {
    console.log("DEAMP LINE PARALLEL");
    deAmpLine(team);
    deAmpCircle(team);
  });

  var transitionDuration = 800;
  //circle options
  var r = 4; //radius
  var borderWidth = 0;

  function addCircles(team) {
    //appends the circles
    var tag = team.replace(/[\s']+/g, ''); 

    for (let i = 0; i < dimensions.length; i ++) {
      console.log(dimensions)
      console.log("ADD CIRCLES PARALLELLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL ");

      var circle = svg.selectAll("circle.parallelCircle." + tag + i);

      circle
      .data(data_parallel                
        .filter(function(d){ return d.season == season_filter; })
        .filter(function(d){ return d.team == team; }))
      .enter().append("circle")
        .style("opacity", 1)
        .attr("class", function(d) {
            return "parallelCircle " + tag + i;
        })
        .attr("r", r)
        .attr("fill", function(d){
          return teamColor(d.team, 1);
        })
        .attr("stroke", function(d){
          return teamColor(d.team, 1);
        })
        .attr("stroke-width", borderWidth)
        .attr("cx", function(d){
          //if (d.ppg == 0) {return padding+25;}
          console.log(d);
          console.log("t: " + x(dimensions[i]) );
          return x(dimensions[i]);
          //return x(10);
        })
        .attr("cy", function(d) {
          console.log("T: " + y[dimensions[i]](d[dimensions[i]]) );
            return y[dimensions[i]](d[dimensions[i]]);
        })
      .on("mouseover", () => {
        dispatch_map.call("ampTeam", this, team);
        ampLine(team);
        ampCircle(team);
        mouseover();
      })
      .on("mouseleave", () => {
        dispatch_map.call("deAmpTeam", this, team);
        deAmpLine(team);
        deAmpCircle(team);
        mouseleave();
      })
      .on("mousemove", (d) => 
      {
        mousemove("circle", dimensions[i], d);
      })
      }
  }

  function removeCircles(team) {
    //appends the circles
    var tag = team.replace(/[\s']+/g, ''); 

    for (let i = 0; i < dimensions.length; i ++) {
      svg.selectAll("circle.parallelCircle." + team.replace(/[\s']+/g, '') + i)
        .transition().duration(fadingTransitionDuration)
        .style("opacity", 0)
    .remove()
      }
  }

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
      .style("opacity", 0)
      .style("fill", "none")
      .style("stroke-width", lineWidth + "px")
      .style("stroke", (d) => {
        return teamColor(d.team, 1);
      })
      .style("opacity", 1)
      .on("mouseover", () => {
        dispatch_map.call("ampTeam", this, team);
        svg.selectAll("circle.parallel")
        ampLine(team);
        ampCircle(team);
        mouseover();
      })
      .on("mouseleave", () => {
        dispatch_map.call("deAmpTeam", this, team);
        deAmpLine(team);
        deAmpCircle(team);
        mouseleave();
      })
      .on("mousemove", () => 
      {
        mousemove("line", null, team);
      })
      .transition().duration(fadingTransitionDuration).call( function(selection) {
        selection.style("opacity", 1);
      });


  }

  function removeLine(team) {
    svg.selectAll("path.parallelPath." + team.replace(/[\s']+/g, ''))
        .transition().duration(fadingTransitionDuration)
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

  function updateCircles() {
    //appends the circles

    for (let j = 0; j < teamFilters.length; j++) {
      var tag = teamFilters[j].replace(/[\s']+/g, ''); 
      for (let i = 0; i < dimensions.length; i++) {
      console.log("WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA " + tag + i);
      console.log(svg.selectAll(".parallelCircle." + tag ));
        var circles = svg.selectAll("circle.parallelCircle." + tag + i);

        circles
        .data(data_parallel                
          .filter(function(d){ return d.season == season_filter; })
          .filter(function(d){ return d.team == teamFilters[j]; }))
        .transition().duration(transitionDuration)
          .attr("class", function(d) {
              return "parallelCircle " + tag + i;
          })
          .attr("cx", function(d){
            //if (d.ppg == 0) {return padding+25;}
            console.log(d);
            console.log("t: " + x(dimensions[i]) );
            return x(dimensions[i]);
            //return x(10);
          })
          .attr("cy", function(d) {
            console.log("T: " + y[dimensions[i]](d[dimensions[i]]) );
              return y[dimensions[i]](d[dimensions[i]]);
          })
        }
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
      .on("mouseover", () => 
      {
        mouseover();
      })
      .on("mousemove", (d) => 
      {
        mousemove("label", d, null);
      })
      .on("mouseleave", () => 
      {
        mouseleave();
      });

  var tooltip = d3.select("#parallelcoords")
        .append("div")
        .attr("id", "tooltip_p")
        .style("z-index", 1)
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("color", "white")
        .style("background-color", "#373434")
        .style("border", "1px solid #ddd")
        .style("border-width", "1px")
        .style("padding", "10px")
        .style("font-family", "sans-serif");

  var mouseover = function() {
        console.log("mouseover tooltip");
        tooltip
        .style("opacity", 1);
    }

    var mousemove = function(type, label, data) {
      var tooltipText;
      switch (label) {
        case "Rank":
          tooltipText = "Team ranking in regular season";
          break;
        case "Avg Age":
          tooltipText = "Average age of players in team";
          break;
        case "Wins":
          tooltipText = "Number of wins";
          break;
        case "Losses":
          tooltipText = "Number of losses";
          break;
        case "ORtg":
          tooltipText = "Offense rating, TODO";
          break;
        case "NRtg":
          tooltipText = "Offense rating, TODO";
          break;
        case "ORtg":
          tooltipText = "TODO";
          break;
        case "DRtg":
          tooltipText = "TODO";
          break;
        case "Pace":
          tooltipText = "TODO";
          break;
        case "Attendance":
          tooltipText = "Total public attendance in team games";
          break;
        case "Win%":
          tooltipText = "Win-rate";
          break;
        case "eFG%":
          tooltipText = "TODO";
          break;
        default:
          tooltipText = "";
          break;
      }
        if (type == "label"){
          console.log("PARALLEL TOOOOOOOOOOOOOOOOOOOOOLTIP");
          console.log(tooltipText);
          tooltip
          .html(tooltipText)
          .style("left", (d3.event.pageX + 10) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
          .style("top", (d3.event.pageY - 50) + "px")
        }
        else if (type == "line"){
          tooltip
          .html("<b>" + data + "</b>")
          .style("left", (d3.event.pageX + 10) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
          .style("top", (d3.event.pageY - 50) + "px")
        }
        else if (type == "circle"){
          tooltip
          .html("<b>" + data.team + "</b>" + "<br><b>" + label + ": </b>" + data[label])
          .style("left", (d3.event.pageX + 10) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
          .style("top", (d3.event.pageY - 50) + "px")
        }
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function(d) {
        console.log("mouseleave tooltip")
        tooltip
        .html("")
            .style("opacity", 0)
            .style("left", 0 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", 0 + "px")
    }
}