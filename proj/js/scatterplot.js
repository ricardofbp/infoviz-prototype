var data_scatter;

var isPPG = true;
var circleRemoveFlag = "flag1"

var svg_scatterplot;

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
    var r = 3.2; //radius
    var borderWidth = 1.5;

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
        .text("Salary (in 10000$)");

    var clip = scatterplot.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", w )
        .attr("height", h )
        .attr("x", padding+25)
        .attr("y", 0);

    svg_scatterplot = scatterplot.append("g")
        .attr("clip-path", "url(#clip)");

    //tooltip related
    var tooltip = d3.select("#scatterplot")
        .append("div")
        .attr("id", "tooltip_s")
        //.style("z-index", 2)
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("color", "white")
        .style("background-color", "#373434")
        .style("border", "1px solid #ddd")
        .style("border-width", "1px")
        .style("padding", "10px")
        .style("font-family", "sans-serif");

    var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
      .extent( [ [padding+25, 0], [w,h-padding] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", zoom) // Each time the brush selection changes, trigger the 'updateChart' function
      //.style("z-index", 1)
      ;

    svg_scatterplot
        .append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var mouseover = function(d) {
        console.log("mouseover tooltip");
        tooltip
        .style("opacity", 1)
    }

    var mousemove = function(d) {
        tooltip
        .html("<b>Player:</b> " + d.name + "<br><b>PPG</b>: " + d.ppg + "<br><b>PPM:</b> " + d.ppm + "<br><b>Salary:</b> $" + d.salary)
        .style("left", (d3.mouse(this)[0] + 480) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
    .style("top", (d3.mouse(this)[1]) + 330 + "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function(d) {
        console.log("mouseleave tooltip")
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    //appends the circles
    svg_scatterplot.selectAll("circle.team_filter")
        .data(data_scatter                
            .filter(function(d){ return d.season == season_filter; })
            .filter(function(d){ return d.team == team_filter; }))
        .enter().append("circle")
        .attr("class", function(d) {
            return "team_filter";
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
        //console.log(xscale("xscale ppg: " + d.ppg));
            if (d.ppg == 0) {return padding+25;}
            return xscalePPG(d.ppg);
        })
        .attr("cy", function(d) {
            return hscale(d.salary/10000);
        })
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )

    svg_scatterplot.selectAll("circle.team_filter2")
        .data(data_scatter                
            .filter(function(d){ return d.season == season_filter; })
            .filter(function(d){ return d.team == team_filter2; }))
        .enter().append("circle")
        .attr("class", function(d) {
            return "team_filter2";
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
        //console.log(xscale("xscale ppg: " + d.ppg));
            if (d.ppg == 0) {return padding+25;}
            return xscalePPG(d.ppg);
        })
        .attr("cy", function(d) {
            return hscale(d.salary/10000);
        })
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )

    //changes circles when selecting a team
    dispatch_scatter.on("team", function() {
        console.log("dispatch team scatter");
        changeCircles(true);        
    })

    //change circles when year slider changes
    dispatch_scatter.on("year", function() { 
        console.log("dispatch year scatter");
        changeCircles(true);        
    })

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
            changeCircles(false);
        
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
            changeCircles(false);

    })


    ////////////////////////////////////////////////////////
    //                    FUNCTIONS                       //
    ////////////////////////////////////////////////////////
    function changeCircleGroup(group) {
        svg_scatterplot.selectAll("group")
            .data(data_scatter                
                .filter(function(d){ return d.season == season_filter; })
                .filter(function(d){ return d.team == team_filter; }))
            .transition().duration(1000)
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
    }
    function changeCircles(flag) {

        //need for the hack to hide circles when team has fewer members
        if (flag) {
                svg_scatterplot.selectAll("circle.team_filter").transition().duration(1000)
                    .attr("opacity", 0)
                svg_scatterplot.selectAll("circle.team_filter2").transition().duration(1000)
                    .attr("opacity", 0)
            
        }
        if (team_filter == null)
                svg_scatterplot.selectAll("circle.team_filter").transition().duration(0)
                    .attr("opacity", 0);
        if (team_filter2 == null)
            svg_scatterplot.selectAll("circle.team_filter2").transition().duration(0)
                .attr("opacity", 0);

        svg_scatterplot.selectAll("circle.team_filter")
            .data(data_scatter                
                .filter(function(d){ return d.season == season_filter; })
                .filter(function(d){ return d.team == team_filter; }))
            .transition().duration(1000)
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

        svg_scatterplot.selectAll("circle.team_filter2")
            .data(data_scatter                
                .filter(function(d){ return d.season == season_filter; })
                .filter(function(d){ return d.team == team_filter2; }))
            .transition().duration(1000)
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
        } else {
            x
            .domain([ x.invert(extent[0]), x.invert(extent[1]) ])
            .range([padding+25,w-padding+25]);
            d3.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
         }
        // Update axis and circle position
        xaxis

            .transition().duration(1000)
            .attr("transform","translate(0," + (h-padding) + ")")
            .call(d3.axisBottom(x)
                .ticks(10, tickFormat));

        changeCircles(false);
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
    }

}