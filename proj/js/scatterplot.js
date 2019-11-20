var data_scatter;

var team_filter = "Atlanta Hawks";
var season_filter = 2000;

var isPPG = true;

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
  console.log("linha1: " + d[0].name);
  console.log("name: " + d.name);
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

    var r = 3;

    var padding = 30;

    var bar_w = Math.floor((w-padding*2)/data_scatter.length)-1;


    var xscalePPM = d3.scaleLinear()
        .domain([0, maxPPM])
        .range([padding,w-padding]);

    var xscalePPG = d3.scaleLinear()
        .domain([0, maxPPG])
        .range([padding,w-padding]);

    var hscale = d3.scaleLinear()
        .domain([0,d3.max(data_scatter, function(d) { return d.salary;}) / 10000])
        .range([h-padding,padding]);


    svg_scatterplot = d3.select("#scatterplot")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var yaxis = d3.axisLeft()
          .scale(hscale);

    var xaxisPPG = d3.axisBottom()
        .scale(d3.scaleLinear()
        .domain([0, maxPPG])
        .range([padding+bar_w/2,w-padding-bar_w/2]))
          //.tickFormat(d3.format("d"))
          //.ticks(data.length/4);

    var xaxisPPM = d3.axisBottom()
        .scale(d3.scaleLinear()
        .domain([0, maxPPM])
        .range([padding+bar_w/2,w-padding-bar_w/2]))

    //appends both initial axis (salary and PPG)
    svg_scatterplot.append("g")
        .attr("id", "xaxis")
        .attr("transform","translate(0," + (h-padding) + ")")
        .style("opacity", 0)
        .call(xaxisPPG);

    svg_scatterplot.append("g")
        .attr("id", "xaxis")
        .attr("transform","translate(0," + (h-padding) + ")")
        .call(xaxisPPM);

    svg_scatterplot.append("g")
        .attr("id", "yaxis")
        .attr("transform", "translate(30,0)")
        .call(yaxis);

    //tooltip related
    var tooltip = d3.select("#scatterplot")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("color", "white")
        .style("background-color", "black")
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
        if (isPPG) {
            tooltip
            .html("Player: " + d.name + "<br>PPG: " + d.ppg + "<br>PPM: " + d.ppm + "<br>Salary: $" + d.salary)
            .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d3.mouse(this)[1]) + "px")
        }
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
        .attr("r", r)
        .attr("fill", "rgba(128, 0, 128, 0.5)")
        .attr("cx", function(d, i){
        //console.log(xscale("xscale ppg: " + d.ppg));
            if (d.ppg == 0) {return padding;}
            return xscalePPG(d.ppg);
        })
        .attr("cy", function(d) {
            return hscale(d.salary/10000);
        })
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )


    //changes circles when selecting a team
    d3.selectAll(".team")
        .on("click", function() { //clickevent

            svg_scatterplot.selectAll("circle")
                .data(data_scatter                
                    .filter(function(d){ return d.season == season_filter; })
                    .filter(function(d){ return d.team == team_filter; })).transition().duration(1000)
                .attr("r", r)
                .attr("fill", "rgba(128, 0, 128, 0.5)")
                .attr("cx", function(d, i){
                    if (d.ppg == 0) {return padding;}
                    if (isPPG) {return xscalePPG(d.ppg);}
                    else { return xscalePPM(d.ppm); }
                })
                .attr("cy", function(d) {
                    return hscale(d.salary/10000);
                })
                .on("mouseover", mouseover )
                .on("mousemove", mousemove )
                .on("mouseleave", mouseleave )
        
    })

    dispatch.on("year", function() { //clickevent
        svg_scatterplot.selectAll("circle")
            .data(data_scatter                
                .filter(function(d){ return d.season == season_filter; })
                .filter(function(d){ return d.team == team_filter; })).transition().duration(1000)
            .attr("r", r)
            .attr("fill", "rgba(128, 0, 128, 0.5)")
            .attr("cx", function(d, i){
                if (d.ppg == 0) {return padding;}
                if (isPPG) {return xscalePPG(d.ppg);}
                else { return xscalePPM(d.ppm); }
            })
            .attr("cy", function(d) {
                return hscale(d.salary/10000);
            })
            .on("mouseover", mouseover )
            .on("mousemove", mousemove )
            .on("mouseleave", mouseleave )
        
    })

    //changes circles when changing to PPG
    d3.select("#ppg")
      .on("click", function() { //clickevent
            isPPG = true;
            svg_scatterplot.selectAll("circle")
                .data(data_scatter                
                    .filter(function(d){ return d.season == season_filter; })
                    .filter(function(d){ return d.team == team_filter; })).transition().duration(1000)
                    .attr("r", r)
                    .attr("fill", "rgba(128, 0, 128, 0.5)")
                    .attr("cx", function(d, i){
                    //console.log(xscale("xscale ppg: " + d.ppg));
                        if (d.ppg == 0) {return padding;}
                        return xscalePPG(d.ppg);
                    })
                    .attr("cy", function(d) {
                        return hscale(d.salary/10000);
                    })
                    .on("mouseover", mouseover )
                    .on("mousemove", mousemove )
                    .on("mouseleave", mouseleave )

            d3.select("#xaxis").remove()
            svg_scatterplot.append("g")
                .attr("id", "xaxis")
                .attr("transform","translate(0," + (h-padding) + ")")
                .call(xaxisPPG);
        
    })

    //changes circles when changing to PPM
    d3.select("#ppm")
      .on("click", function() { //clickevent
            isPPG = false;
            svg_scatterplot.selectAll("circle")
                .data(data_scatter                
                    .filter(function(d){ return d.season == season_filter; })
                    .filter(function(d){ return d.team == team_filter; })).transition().duration(1000)
                    .attr("r", r)
                    .attr("fill", "rgba(128, 0, 128, 0.5)")
                    .attr("cx", function(d, i){
                    //console.log(xscale("xscale ppg: " + d.ppg));
                        if (d.ppg == 0) {return padding;}
                        return xscalePPM(d.ppm);
                    })
                    .attr("cy", function(d) {
                        return hscale(d.salary/10000);
                    })
                    .on("mouseover", mouseover )
                    .on("mousemove", mousemove )
                    .on("mouseleave", mouseleave )
        
            d3.select("#xaxis").remove()
            svg_scatterplot.append("g")
                .attr("id", "xaxis")
                .attr("transform","translate(0," + (h-padding) + ")")
                .call(xaxisPPM);

    })
}