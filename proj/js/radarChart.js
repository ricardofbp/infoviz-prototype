var margin = { top: 50, right: 80, bottom: 50, left: 80 };

//var data2;

var data_radar;
var new_data;
var new_data_aux;
var blobWrapper;
var blobCircleWrapper;
var radarLine;
var tooltip;


d3.csv("../dataset/radarchart_dataset.csv")
.then(function(d){
	data_radar = d;
	gen_viz();
	
});

//can be done in the d3.csv conversor
function transformData(data){
	var data_final = []

	for (var i = data.length - 1; i >= 0; i--) {
		var d = {}
		d.Player = data[i].Player;
		d.Season = data[i].Season;
		d.Team = data[i].Team;
		var axes = [];
		axes.push({axis: "Salary", value: data[i].Salary})
		axes.push({axis: "PPG", value: data[i].PPG})
		axes.push({axis: "Height", value: data[i].Height})
		axes.push({axis: "Weight", value: data[i].Weight})
		axes.push({axis: "PPM", value: data[i].PPM})
		d.axes = axes;
		data_final.push(d);
	}
	//data_radar = data_final;
	return data_final;
}

const wrap = (text, width) => {
	text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

		while (word = words.pop()) {
			line.push(word);
		 	tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			 }
		}
	});
}//wrap

const color = d3.scaleOrdinal().range(["#AFC52F", "#ff6600", "#2a2fd4"]);
const outline_width = 2;
const outline_dots_radius = 4;

var w = 250;
var h = 250;
/*
data2 = [
			{ name: 'Kobe Bryant',
					axes: [
						{axis: 'Salary', value: 30453805},
						{axis: 'PPG', value: 22.5},
						{axis: 'Height', value: 198.12},
						{axis: 'Weight', value: 90.8},
						{axis: 'PPM', value: 0.58835},
					]
			},
			{ name: 'Miguel',
					axes: [
						{axis: 'Salary', value: 2000000},
						{axis: 'PPG', value: 21.5},
						{axis: 'Height', value: 130.12},
						{axis: 'Weight', value: 60},
						{axis: 'PPM', value: 0.68},
					]

			}
			];
*/
const max = Math.max;
const sin = Math.sin;
const cos = Math.cos;
const HALF_PI = Math.PI / 2;

const allAxis = ["Salary", "PPG", "Height", "Weight", "PPM"]; 	//Names of each axis
const allAxis_units = ['$', '', 'cm', 'kg', ''];
const total = allAxis.length; 				            //The number of different axes

const radius = Math.min(w/2, h/2);                      //Radius of the outermost circle
const format = d3.format('.2f');         			 	//Formatting
	
const angleSlice = Math.PI * 2 / total;		            //The width in radians of each "slice"


function gen_viz() {
////////////////////////////////////////////
///////////// Create the svg container /////
////////////////////////////////////////////
	const parent = d3.select(".radarChart");

	var svg = parent.append("svg")
			.attr("width", w + margin.left + margin.right)
			.attr("height", h + margin.top + margin.bottom)
			.attr("class", "radar");


	let g = svg.append("g")
			.attr("transform", "translate(" + (w/2 + margin.left) + "," + (h/2 + margin.top) + ")");

	////////////////////////////////////////
	///// Circular grid ////////////////////
	////////////////////////////////////////
	let filter = g.append('defs').append('filter').attr('id','glow'),
			feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
			feMerge = filter.append('feMerge'),
			feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
			feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	var axisGrid = g.append("g")
				.attr("class", "axisWrapper");

	axisGrid.selectAll(".levels")
		   .data(d3.range(1, (4)).reverse())  //levels + 1
		   .enter()
			.append("circle")
			.attr("class", "gridCircle")
			.attr("r", d => radius / 3 * d)     //levels
			.style("fill", "#CDCDCD")
			.style("stroke", "#CDCDCD")
			.style("fill-opacity", 0.1)
			.style("filter" , "url(#glow)");

	////////////////////////////////////////
	//// Draw the axes /////////////////////
	////////////////////////////////////////

	//Scales

	//Scale for salary
	const SalaryScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, 30453805]);

	const maxSalary = 30453805

	//Scale for height
	const HeightScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, 228.6]);

	const maxHeight = 228.6;

	//Scale for weight
	const WeightScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, 163.44]);

	const maxWeight = 163.44;

	//Scale for the PPM
	const PPMScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, 1.5]);

	const maxPPM = 1.5;

	//Scale for PPG
	const PPGScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, 29.75]);

	const maxPPG = 29.75;

	const maxValue = 60;
	const rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);

	/*
	axisGrid.selectAll(".axisLabel")
		   .data(allAxis)
		   .enter().append("text")
		   .attr("class", "axisLabel")
		   .attr("x", (d, i) => cos(angleSlice * i - HALF_PI))
		   .attr("y", (d, i) => - radius)
		   .attr("dy", "0.4em")
		   .style("font-size", "10px")
		   .attr("fill", "#737373")
		   .text(d => "aiai");
	*/

	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");

	//Draw the scales lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", (d, i) => eval(allAxis[i] + "Scale")(eval("max" + allAxis[i]) *1.01) * cos(angleSlice * i - HALF_PI))
		.attr("y2", (d, i) => eval(allAxis[i] + "Scale")(eval("max" + allAxis[i]) *1.01) * sin(angleSlice * i - HALF_PI))
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	console.log("axis");

	axis.append("text")
			.attr("class", "legend")
			.style("font-size", "11px")
			.attr("text-anchor", "middle")
			.attr("dy", "0.35em")
			.attr("x", (d,i) => eval(allAxis[i] + "Scale")(eval("max" + allAxis[i]) * 1.2) * cos(angleSlice * i - HALF_PI))
			.attr("y", (d,i) => eval(allAxis[i] + "Scale")(eval("max" + allAxis[i]) * 1.2) * sin(angleSlice * i - HALF_PI))
			.text(d => d)
			.call(wrap, 60);


	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////

	radarLine = d3.radialLine()
		.curve(d3.curveLinearClosed)
		.radius((d, i) => (eval(allAxis[i] + "Scale")(d.value)))
		.angle((d,i) => i * angleSlice);

	////////////////////////////////////////////////////////
	/////////////////Filter the data////////////////////////
	////////////////////////////////////////////////////////
	
	new_data = transformData(data_radar
			.filter(function(d){ return d.Season == season_filter;})
			.filter(function(d){ return d.Team == team_filter;})
			.filter(function(d){ return d.Player == player1_filter}));
	////////////////////////////////////////////////////////

	new_data_aux = transformData(data_radar.
			filter(function(d){ return d.Season == season_filter;}).
			filter(function(d){ return d.Team == team_filter;}));

	blobWrapper = g.selectAll(".radarWrapper")
		.data(new_data)
		.enter().append("g")
		.attr("class", "radarWrapper");

	blobWrapper
		.append("path")
		.attr("class", "radarArea")
			.attr("d", d => radarLine(d.axes))
			.style("fill", (d,i) => teamColor(d.Team, 1))
			.style("fill-opacity", 0.35) //opacity area
			.on('mouseover', function(d, i) {
				//Dim all blobs
				parent.selectAll(".radarArea")
					.transition().duration(200)
					.style("fill-opacity", 0.1);
				//Bring back the hovered over blob
				d3.select(this)
					.transition().duration(200)
					.style("fill-opacity", 0.7);
			})
			.on('mouseout', () => {
				//Bring back all blobs
				parent.selectAll(".radarArea")
					.transition().duration(200)
					.style("fill-opacity", 0.35); //opacity area
			});

	//Create the outlines
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d.axes); })
		.style("stroke-width", outline_width + "px")
		.style("stroke", (d,i) => teamColor(d.Team, 2))
		.style("fill", "none")
		.style("filter" , "url(#glow)");

	//Append the outline circles
	blobWrapper.selectAll(".radarCircle")
		.data(d => d.axes)
		.enter()
		.append("circle")
		.attr("class", "radarCircle")
		.attr("r", outline_dots_radius)
		.attr("cx", (d,i) => eval(allAxis[i] + "Scale")(d.value) * cos(angleSlice * i - HALF_PI))
		.attr("cy", (d,i) => eval(allAxis[i] + "Scale")(d.value) * sin(angleSlice * i - HALF_PI))
		.style("fill", (d) => color(d.id))
		.style("fill-opacity", 0.8);


	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////

	blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(new_data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");

	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(d => d.axes)
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", outline_dots_radius * 1.5)
		.attr("cx", (d,i) => eval(allAxis[i] + "Scale")(d.value) * cos(angleSlice*i - HALF_PI))
		.attr("cy", (d,i) => eval(allAxis[i] + "Scale")(d.value) * sin(angleSlice*i - HALF_PI))
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
			tooltip
				.attr('x', this.cx.baseVal.value - 10)
				.attr('y', this.cy.baseVal.value - 10)
				.transition()
				.style('display', 'block')
				.text(format(d.value) + allAxis_units[i]);
		})
		.on("mouseout", function(){
			tooltip.transition()
				.style('display', 'none').text('');
		});

	tooltip = g.append("text")
	.attr("class", "tooltip")
	.attr('x', 0)
	.attr('y', 0)
	.style("font-size", "12px")
	.style('display', 'none')
	.attr("text-anchor", "middle")
	.attr("dy", "0.35em");

	//////////////////////////////////////////////////
	/////////////// ON CLICK /////////////////////////
	//////////////////////////////////////////////////
	dispatch_radar.on("team", function(){
		changeRadar();
	});

	function changeRadar(){

		new_data_aux = transformData(data_radar.
			filter(function(d){ return d.Season == season_filter;}).
			filter(function(d){ return d.Team == team_filter;}));

		new_data = transformData(data_radar
			.filter(function(d){ return d.Season == season_filter;})
			.filter(function(d){ return d.Team == team_filter;})
			.filter(function(d){ return d.Player == player1_filter;}));

		blobWrapper = g.selectAll(".radarWrapper")
		.data(new_data)
		.transition().duration(1000)
		//.attr("class", "radarWrapper");

		g.selectAll(".radarArea")
			.data(new_data)
		.transition().duration(1000)
			//.attr("class", "radarArea")
				.attr("d", d => radarLine(d.axes))
				.style("fill", (d,i) => teamColor(d.Team, 1))
				.style("fill-opacity", 0.35) //opacity area
		//Create the outlines
		g.selectAll(".radarStroke")//.append("path")
		.data(new_data)
		.transition().duration(1000)
			//.attr("class", "radarStroke")
			.attr("d", function(d,i) { return radarLine(d.axes); })
			.style("stroke-width", outline_width + "px")
			.style("stroke", (d,i) => teamColor(d.Team, 1))
			.style("fill", "none")
			.style("filter" , "url(#glow)");
	
		//Append the outline circles
		g.selectAll(".radarWrapper.radarCircle")
			.data(new_data)
			//.enter()
			.transition().duration(1000)
			//.append("circle")
			//.attr("class", "radarCircle")
			.attr("r", outline_dots_radius)
			.attr("cx", (d,i) => eval(allAxis[i] + "Scale")(d.value) * cos(angleSlice * i - HALF_PI))
			.attr("cy", (d,i) => eval(allAxis[i] + "Scale")(d.value) * sin(angleSlice * i - HALF_PI))
			.style("fill", (d) => color(d.id))
			.style("fill-opacity", 0.8);
	
		
		/////////////////////////////////////////////////////////
		//////// Append invisible circles for tooltip ///////////
		/////////////////////////////////////////////////////////
	
		blobCircleWrapper = g.selectAll(".radarCircleWrapper")
			.data(new_data)
			.enter().append("g")
			.attr("class", "radarCircleWrapper");
	
		//Append a set of invisible circles on top for the mouseover pop-up
		blobCircleWrapper.selectAll(".radarInvisibleCircle")
			.data(d => d.axes)
			.enter().append("circle")
			.attr("class", "radarInvisibleCircle")
			.attr("r", outline_dots_radius * 1.5)
			.attr("cx", (d,i) => eval(allAxis[i] + "Scale")(d.value) * cos(angleSlice*i - HALF_PI))
			.attr("cy", (d,i) => eval(allAxis[i] + "Scale")(d.value) * sin(angleSlice*i - HALF_PI))
			.style("fill", "none")
			.style("pointer-events", "all")
			.on("mouseover", function(d,i) {
				tooltip
					.attr('x', this.cx.baseVal.value - 10)
					.attr('y', this.cy.baseVal.value - 10)
					.transition()
					.style('display', 'block')
					.text(format(d.value) + allAxis_units[i]);
			})
			.on("mouseout", function(){
				tooltip.transition()
					.style('display', 'none').text('');
			});

		tooltip = g.append("text")
		.attr("class", "tooltip")
		.attr('x', 0)
		.attr('y', 0)
		.style("font-size", "12px")
		.style('display', 'none')
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em");
		
	}

}