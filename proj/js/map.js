var svg_map;
var data_map;

d3.csv("../dataset/map_dataset.csv").then(function(d) {
  data_map = d;
  renderMap();
});



function renderMap() {

  var width = 760;
  var mapRatio = 0.5;
  var height = width * mapRatio;

  var logoWidth = 30;
  var logoHeight = 30;

  var svg = d3.select("#USMap")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

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

  dispatch_map.on("removeTeam", function(team) {
    console.log("[INFO] removeTeam map");
    removeLine(team); 
    svg.select(".mark." + team.replace(/\s+/g, ''))
      .transition().duration(transitionDuration- 100)
      .style("outline",  "0px solid " + teamColor(team, 1));
  });

  dispatch_map.on("addTeam", function(team) {
    console.log("[INFO] addTeam map");
    addLine(team);
    svg.select(".mark." + team.replace(/\s+/g, ''))
      .transition().duration(transitionDuration- 100)
      .style("outline",  "2px solid " + teamColor(team, 1));      
  });

  dispatch_map.on("year", function() { 
    console.log("[INFO] year map");
    changeLines()
  });

  dispatch_map.on("ampTeam", function(team) {
      amplifyTeam(team);
  });

  dispatch_map.on("deAmpTeam", function(team) {
      deAmplifyTeam(team);
  })

  var transitionDuration = 200;

  function tweenDash() {
    var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function (t) { return i(t); };
  }

  function appearLineTransition(path) {
    path.transition()
        .duration(1000)
        .attrTween("stroke-dasharray", tweenDash);
  }

  function addLine(team) {
    var tag = team.replace(/[\s']+/g, ''); 

    svg.selectAll("path." + tag)
    .data(data_map
      .filter(function(d){ return d.draft_year == season_filter; })
      .filter(function(d){ return d.team == team; }))
    .enter().append("path")
      .attr("class", tag)
      .attr("d", (d) => {
        //return link(getStateCoords(d.state), getTeamCoords(d.team));
        return lngLatToArc(getStateCoords(d.state), getTeamCoords(d.team), 0.7);
      })
      .style("fill", "none")
      .style("stroke", (d) => {
        return teamColor(d.team);
      })
      .style("stroke-width", 2)
      .call(appearLineTransition);
  }

  function removeLine(team) {
     svg.selectAll("path." + team.replace(/[\s']+/g, ''))
        .transition().duration(transitionDuration)
        .style("opacity", 0)
    .remove()
  }

  function changeLines() {
    for (let i = 0; i < teamFilters.length; i++) {
      var tag = teamFilters[i].replace(/[\s']+/g, '');
      
      var lines = svg.selectAll("path." + tag);
      console.log("LOGGING LINES: " + lines);
      lines
        .data(data_map
          .filter(function(d){ return d.draft_year == season_filter; })
          .filter(function(d){ return d.team == teamFilters[i]; }))
        //.transition().duration(transitionDuration + 800)
        .attr("class", tag)
        .attr("d", (d) => {
          //return link(getStateCoords(d.state), getTeamCoords(d.team));
          return lngLatToArc(getStateCoords(d.state), getTeamCoords(d.team), 0.7);
        })
        .style("fill", "none")
        .style("stroke", (d) => {
          return teamColor(d.team);
        })
        .style("stroke-width", 2)
        .call(appearLineTransition);
      /*
        */
      addLine(teamFilters[i]);
      /*
      */
      lines
        .data(data_map                
            .filter(function(d){ return d.draft_year == season_filter; })
            .filter(function(d){ return d.team == teamFilters[i]; }))
        .exit()
            .transition().duration(transitionDuration)
            .style("opacity", 0)
            .remove()
    }
  }

  function amplifyTeam(team) {
    svg.select(".mark." + team.replace(/\s+/g, ''))
      .transition().duration(transitionDuration)
      .attr("x", -(logoWidth + 20)/2)
      .attr("y", -(logoHeight + 20)/2)
      .attr('width', logoWidth + 20)
      .attr('height', logoHeight + 20);
  }

  function deAmplifyTeam(team) {
    svg.select(".mark." + team.replace(/\s+/g, ''))
      .transition().duration(transitionDuration)
      .attr("x", -logoWidth/2)
      .attr("y", -logoHeight/2)
      .attr('width', logoWidth)
      .attr('height', logoHeight);
  }

  function lngLatToArc(sourceLngLat, targetLngLat, bend){
    // If no bend is supplied, then do the plain square root
    bend = bend || 1;
    // `d[sourceName]` and `d[targetname]` are arrays of `[lng, lat]`
    // Note, people often put these in lat then lng, but mathematically we want x then y which is `lng,lat`

    if (targetLngLat && sourceLngLat) {
      var sourceXY = projection( sourceLngLat ),
          targetXY = projection( targetLngLat );

      // Uncomment this for testing, useful to see if you have any null lng/lat values
      // if (!targetXY) console.log(d, targetLngLat, targetXY)
      var sourceX = sourceXY[0],
          sourceY = sourceXY[1];

      var targetX = targetXY[0],
          targetY = targetXY[1];

      var dx = targetX - sourceX,
          dy = targetY - sourceY,
          dr = Math.sqrt(dx * dx + dy * dy)*bend;

      // To avoid a whirlpool effect, make the bend direction consistent regardless of whether the source is east or west of the target
      var west_of_source = (targetX - sourceX) < 0;
      if (west_of_source) return "M" + targetX + "," + targetY + "A" + dr + "," + dr + " 0 0,1 " + sourceX + "," + sourceY;
     return "M" + targetX + "," + targetY + "A" + dr + "," + dr + " 0 0,0 " + sourceX + "," + sourceY;
      
    } else {
      return "M0,0,l0,0z";
    }
  }

  function link(p1, p2) {
            var start = projection(p1);
            var end = projection(p2);
            return "M" + start[0] + "," + start[1]
                + "C" + (start[0] + end[0]) / 2 + "," + start[1]
                + " " + (start[0] + end[0]) / 2 + "," + start[1]
                + " " + end[0] + "," + end[1];
        }

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
            .transition().duration(transitionDuration- 100)
            .style("outline",  "2px solid " + teamColor(d.team, 1));
        }
        else {
          svg.select(".mark." + d.team.replace(/\s+/g, ''))
            .transition().duration(transitionDuration- 100)
            .style("outline",  "0px solid " + teamColor(d.team, 1));
        }
      })
      .on("mouseover", (d) => {
        amplifyTeam(d.team);
      })
      .on("mouseleave", (d) => {
        deAmplifyTeam(d.team);
      })

  });

 }
