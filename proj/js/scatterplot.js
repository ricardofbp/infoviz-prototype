var data_scatter;
var svg_scatterplot;

var isPPG = true;

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
  data_scatter = d;
  render();
});


function render() {
  // Add X axis
  var scatterplot;
    var maxPPG = 0
    var maxPPM = 0;

    for (let i = 0; i < data_scatter.length; i++) {
        if (data_scatter[i].ppm > maxPPM) {
            maxPPM= data_scatter[i].ppm;
        } 
        if (data_scatter[i].ppg > maxPPG) {
            maxPPG= data_scatter[i].ppg;
        }
      }

    var w = 300;
    var h = 300;

    //circle options
    var r = 3.9; //radius
    var borderWidth = 2.3;

    var padding = 30;

    var bar_w = Math.floor((w-padding*2)/data_scatter.length)-1;

    scatterplot = d3.select("#scatterplot")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var xscalePPM = d3.scaleLinear()
        .domain([0, maxPPM])
        .range([padding+25,w-padding+25]);

    var xscalePPG = d3.scaleLinear()
        .domain([0, maxPPG])
        .range([padding+25,w-padding+25]);

    var hscale = d3.scaleLinear()
        .domain([0,d3.max(data_scatter, function(d) { return d.salary;}) / 10000])
        .range([h-padding,padding]);

    var ySalary = d3.axisLeft()
          .scale(hscale);

    var xPPG = d3.axisBottom()
        .scale(d3.scaleLinear()
        .domain([0, maxPPG])
        .range([padding+bar_w/2,w-padding-bar_w/2]))
          //.tickFormat(d3.format("d"))
          //.ticks(data.length/4);

    var xPPM = d3.axisBottom()
        .scale(d3.scaleLinear()
        .domain([0, maxPPM])
        .range([padding+bar_w/2,w-padding-bar_w/2]))

    //appends both initial axis (salary and PPG)
    var xaxis = scatterplot.append("g")
        .attr("id", "axisPPG")
        .attr("transform","translate(25," + (h-padding) + ")")
        .call(xPPG);

    var yaxis = scatterplot.append("g")
        .attr("id", "yaxis")
       // .style("padding-left", "100px")
        .attr("transform", "translate(55,0)")
        .call(ySalary);

    var ylabel = scatterplot.append("text")  
        .attr("id", "ylabel")
        .style("font-family", "sans-serif")
        .style("font-size", "12px")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", -h/2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Salary (in 10k $)");

    var tooltip = d3.select("#scatterplot")
        .append("div")
        .attr("id", "tooltip_s")
        .style("z-index", 1)
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("color", "white")
        .style("background-color", "#373434")
        .style("border", "1px solid #ddd")
        .style("border-width", "1px")
        .style("padding", "10px")
        .style("font-family", "sans-serif");

    var clip = scatterplot.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", w )
        .attr("height", h-padding )
        .attr("x", padding+25)
        .attr("y", +5);

    svg_scatterplot = scatterplot.append("g")
        .attr("clip-path", "url(#clip)");

    //tooltip related
    

    var brush = d3.brush()                 // Add the brush feature using the d3.brush function
      .extent( [ [padding+25, 0], [w,h-padding] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", zoom); // Each time the brush selection changes, trigger the 'updateChart' function
      
    svg_scatterplot
        .append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var mouseover = function(d) {
        amplifyCircle(d.name);
        console.log("mouseover tooltip");
        tooltip
        .style("opacity", 1)
    }

    var mousemove = function(d) {
        tooltip
        .html("<b> " + d.name + "<br></b><br><b>PPG</b>: " + d.ppg + "<br><b>PPM:</b> " + d.ppm + "<br><b>Salary:</b> $" + d.salary)
        .style("left", (d3.event.pageX + 10) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (d3.event.pageY - 110) + "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function(d) {
        deAmplifyCircle(d.name);
        console.log("mouseleave tooltip")
        tooltip
            .transition()
            .duration(0)
            .style("opacity", 0)
            .style("left", 1000 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", 1000 + "px")
    }

    //changes circles when changing to PPG
    d3.select("#ppg")
        .on("click", function() {
            isPPG = true; 
            resetAxis();

            d3.select("#ppg")
                .style("background-color", "gray");

            d3.select("#ppm")
                .style("background-color", "#373434")

            console.log("isppmSTART");
            
            xaxis
            .transition().duration(1000)
            .attr("transform","translate(25," + (h-padding) + ")")
            .call(xPPG);

            console.log("isppmEND");
            updateCircles();
        
    })

    //changes circles when changing to PPM
    d3.select("#ppm")
        .on("click", function() { 
            isPPG = false;
            resetAxis();

            d3.select("#ppm")
            .style("background-color", "gray");

            d3.select("#ppg")
            .style("background-color", "#373434")

            console.log("isppg START");
            
            xaxis
            .transition().duration(1000)
            .attr("transform","translate(25," + (h-padding) + ")")
            .call(xPPM);

            console.log("isppgEND");
            updateCircles();

    })


    ////////////////////////////////////////////////////////
    //                    DISPATCH                       //
    ////////////////////////////////////////////////////////


    dispatch_scatter.on("removeTeam", function(team) {
        console.log("[INFO] Removing scatter circles of " + team);
        removeCircles(team);
    });

    dispatch_scatter.on("addTeam", function(team) {
        console.log("[INFO] Adding scatter circles of " + team);
        addCircles(team);        
    });

    dispatch_scatter.on("year", function() { 
        console.log("dispatch year scatter");
        updateCircles();        
    });

    dispatch_scatter.on("ampPlayer", function(player) {
        amplifyCircle(player);
    });

    dispatch_scatter.on("deAmpPlayer", function(player) {
        deAmplifyCircle(player);
    })


    ////////////////////////////////////////////////////////
    //                    FUNCTIONS                       //
    ////////////////////////////////////////////////////////

    function amplifyCircle(player) {
        console.log("[INFO] Amping player " + player);
        svg_scatterplot.selectAll("circle." + player.replace(/\s+/g, ''))
            .transition().duration(200)
            .attr("r", r + 5)
            .attr("stroke-width", borderWidth + 1);
    }

    function deAmplifyCircle(player) {
        console.log("[INFO] DeAmping player " + player);
        svg_scatterplot.selectAll("circle." + player.replace(/\s+/g, ''))
            .transition().duration(200)
            .attr("r", r)
            .attr("stroke-width", borderWidth);
    }

    function removeCircles(team) {
         svg_scatterplot.selectAll("circle." + team.replace(/\s+/g, ''))
            .transition().duration(1000)
                .style("opacity", 0)
            .remove()
    }

    function addCircles(team) {
        //appends the circles
        var tag = team.replace(/\s+/g, ''); 

        svg_scatterplot.selectAll("circle." + tag)
            .data(data_scatter                
                .filter(function(d){ return d.season == season_filter; })
                .filter(function(d){ return d.team == team; }))
            .enter().append("circle")
                .style("opacity", 0)
                .attr("class", function(d) {
                    return tag + " " +
                     d.name.replace(/\s+/g, '');
                })
                .attr("r", r)
                .attr("fill", function(d){
                    return teamColor(d.team, 1);
                })
                .attr("stroke", function(d){
                    return teamColor(d.team, 2);
                })
                .attr("stroke-width", borderWidth)
                .attr("cx", function(d, i){
                    if (d.ppg == 0) {return padding+25;}
                    return xscalePPG(d.ppg);
                })
                .attr("cy", function(d) {
                    return hscale(d.salary/10000);
                })
                .on("click", function(d) {
                    console.log("[INFO] onClick circle scatter");
                    changePlayers(d.name, d.team);
                })
                .on("mouseover", mouseover )
                .on("mousemove", mousemove )
                .on("mouseleave", mouseleave )
            .transition().duration(1000).call( function(selection) {
                selection.style("opacity", 1);
            })
            
    }

    function updateCircles() {
        for (let i = 0; i < teamFilters.length; i++) {
            var tag = teamFilters[i].replace(/\s+/g, ''); 

            var elements = svg_scatterplot.selectAll("circle." + tag)

            elements
            .data(data_scatter                
                .filter(function(d){ return d.season == season_filter; })
                .filter(function(d){ return d.team == teamFilters[i]; }))
            .transition().duration(1000)
            .attr("class", function(d) {
                    return tag + " " +
                     d.name.replace(/\s+/g, '');
            })
            .attr("opacity", 1)
            .attr("r", r)
            .attr("fill", function(d){
                return teamColor(d.team, 1);
            })
            .attr("stroke", function(d){
                return teamColor(d.team, 2);
            })
            .attr("stroke-width", borderWidth)
            .attr("cx", function(d){
                if (d.ppg == 0) {return padding+25;}
                if (isPPG) {return xscalePPG(d.ppg);}
                else { return xscalePPM(d.ppm); }
            })
            .attr("cy", function(d) {
                return hscale(d.salary/10000);
            })

            //add new circles if less circles previously
            addCircles(teamFilters[i]);

            //remove "leftover" circles
            elements
            .data(data_scatter                
                .filter(function(d){ return d.season == season_filter; })
                .filter(function(d){ return d.team == teamFilters[i]; }))
            .exit()
                .transition().duration(1000)
                .style("opacity", 0)
                .remove()
        }
    }

    function resetAxis() {
        xscalePPM = d3.scaleLinear()
            .domain([0, maxPPM])
            .range([padding+25,w-padding+25]);

        xscalePPG = d3.scaleLinear()
            .domain([0, maxPPG])
            .range([padding+25,w-padding+25]);

        xPPG = d3.axisBottom()
            .scale(d3.scaleLinear()
            .domain([0, maxPPG])
            .range([padding+bar_w/2,w-padding-bar_w/2]))

        xPPM = d3.axisBottom()
            .scale(d3.scaleLinear()
            .domain([0, maxPPM])
            .range([padding+bar_w/2,w-padding-bar_w/2]))

        hscale = d3.scaleLinear()
        .domain([0,d3.max(data_scatter, function(d) { return d.salary;}) / 10000])
        .range([h-padding,padding]);

        ySalary = d3.axisLeft()
          .scale(hscale);

    }

    //zoom related stuff
    
    var idleTimeout;

    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function zoom() {
        var x;
        var max;
        var axis;
        var tickFormat; 

        if (isPPG) { 
            x = xscalePPG;
            max = maxPPG;
            axis = xPPG;
            tickFormat = ".1f";
        } else {
            x = xscalePPM;
            max = maxPPM;
            axis = xPPM;
            tickFormat = ".2f";
        } 

        extent = d3.event.selection;

        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if(!extent){
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit

            x
            .domain([0, max])
            .range([padding+25,w-padding+25]);

            hscale
            .domain([0,d3.max(data_scatter, function(d) { return d.salary;}) / 10000])
            .range([h-padding,padding]);
        } else {
            x
            .domain([extent[0][0], extent[1][0]].map(x.invert, x))
            .range([padding+25,w-padding+25]);

            hscale
            .domain([extent[1][1], extent[0][1]].map(hscale.invert, hscale));

            d3.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
         }
        // Update axis and circle position
        xaxis
            .transition().duration(1000)
            .attr("transform","translate(0," + (h-padding) + ")")
            .call(d3.axisBottom(x)
                .ticks(10, tickFormat));

        yaxis
            .transition().duration(1000)
            //.attr("transform","translate(0," + (h-padding) + ")")
            .call(d3.axisLeft(hscale));
                //.ticks(10, tickFormat));

        updateCircles();
    }

}