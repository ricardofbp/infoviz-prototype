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

    svg_scatterplot = d3.select("#scatterplot")
        .append("svg")
        .attr("width", w)
        .attr("height", h)

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
    var xaxis = svg_scatterplot.append("g")
        .attr("id", "axisPPG")
        .attr("transform","translate(25," + (h-padding) + ")")
        .call(xPPG);

    var yaxis = svg_scatterplot.append("g")
        .attr("id", "yaxis")
       // .style("padding-left", "100px")
        .attr("transform", "translate(55,0)")
        .call(ySalary);

    var xlabel = svg_scatterplot.append("text")  
        .style("font-family", "sans-serif")
        .style("font-size", "12px")
        .attr("transform", "rotate(-90)")
        .attr("y", "0px")
        .attr("x",0 - (h / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Salary (in 10000$)");

    //tooltip related
    var tooltip = d3.select("#scatterplot")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("color", "white")
        .style("background-color", "#373434")
        .style("border", "1px solid #ddd")
        .style("border-width", "1px")
        .style("padding", "10px")


    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var mouseover = function(d) {
        tooltip
        .style("opacity", 1)
    }

    var mousemove = function(d) {
        tooltip
        .html("<b>Player:</b> " + d.name + "<br><b>PPG</b>: " + d.ppg + "<br><b>PPM:</b> " + d.ppm + "<br><b>Salary:</b> $" + d.salary)
        .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (d3.mouse(this)[1]) + "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function(d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    //appends the circles
    svg_scatterplot.selectAll("circle")
        .data(data_scatter                
            .filter(function(d){ return d.season == season_filter; })
            .filter(function(d){ return d.team == team_filter; }))
        .enter().append("circle")
        .attr("class", function(d) {
            return circleRemoveFlag;
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
            d3.select("#ppg")
            .style("background-color", "gray");

            d3.select("#ppm")
            .style("background-color", "#373434")

            console.log("isppmSTART");
            isPPG = true;
            xaxis.transition().duration(1000).call(xPPG);
            console.log("isppmEND");
            changeCircles(false);
        
    })

    //changes circles when changing to PPM
    d3.select("#ppm")
      .on("click", function() { 

            d3.select("#ppm")
            .style("background-color", "gray");

            d3.select("#ppg")
            .style("background-color", "#373434")

            console.log("isppg START");
            isPPG = false;
            xaxis.transition().duration(1000).call(xPPM);
           // axisPPG.style("opacity", 0);
            //axisPPM.style("opacity", 1);
            console.log("isppgEND");
            changeCircles(false);

    })

    function changeCircles(flag) {

        //need for the hack to hide circles when team has fewer members
        if (flag) {
            svg_scatterplot.selectAll("circle").transition().duration(0)
                .attr("opacity", 0)
        }

        svg_scatterplot.selectAll("circle")
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
}