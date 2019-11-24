var margin = { top: 50, right: 80, bottom: 50, left: 80 };

//var data2;

var data_radar;
var new_data;
var new_data_aux;
var blobWrapper;
var blobCircleWrapper;
var radarLine;
var tooltip;

var g;

//top values for scales
var maxSalary, maxHeight, maxWeight, maxPPG, maxPPM;

//bottom values for scales 
var minSalary, minHeight, minWeight, minPPG, minPPM;


d3.csv("../dataset/radarchart_dataset.csv")
.then(function(d){
	data_radar = d;
	console.log()
	gen_viz();
	
});

function updateMax(vals){
	maxSalary = vals[0] + vals[0]/10;
	maxPPG = vals[1] + vals[1]/10;
	maxHeight = vals[2] + vals[2]/10;
	maxWeight = vals[3] + vals[3]/10;
	maxPPM = vals[4] + vals[4]/10;
}

function updateMin(vals){               
	minSalary = vals[0] - vals[0]/10;
	minPPG = vals[1] - vals[1]/10;
	minHeight = vals[2] - vals[2]/10;
	minWeight = vals[3] - vals[3]/10;
	minPPM = vals[4] - vals[4]/10;
}

function findMinMax(data){   //receives data already filtered by year
	final_vals_max = [0, 0, 0, 0, 0];
	final_vals_min = [2968886.5, 8.354, 200.357, 98.857, 0.36511];
	for (let i = 0; i < teamColors.length; i++) {
		var team = teamColors[i].team;
		var n_data = data.filter(function(d){ return d.Team == team;});
		if(n_data.length > 0){
			var avg_data_team = getTeamAverage(n_data);
			console.log(avg_data_team);
			for (let i = 0; i < 5; i++) {
				if(avg_data_team[0].axes[i].value > final_vals_max[i]){
					final_vals_max[i] = avg_data_team[0].axes[i].value;
				}
				if(avg_data_team[0].axes[i].value < final_vals_min[i]){
					final_vals_min[i] = avg_data_team[0].axes[i].value;
				}
			}
		}
	}
	updateMax(final_vals_max);
	updateMin(final_vals_min);
	console.log(final_vals_min, final_vals_max)
}

function getTeamAverage(data){
	data_final = [];

	var salary = 0;
	var ppg = 0;
	var height = 0;
	var weight = 0;
	var ppm = 0;
	var d = {}

	for (var i = data.length - 1; i >= 0; i--) {
		salary += parseFloat(data[i].Salary);
		ppg += parseFloat(data[i].PPG);
		height+= parseFloat(data[i].Height);
		weight += parseFloat(data[i].Weight);
		ppm += parseFloat(data[i].PPM);
	}
	var axes = [];
	axes.push({axis: "Salary", value: salary/data.length});
	axes.push({axis: "PPG", value: ppg/data.length});
	axes.push({axis: "Height", value: height/data.length});
	axes.push({axis: "Weight", value: weight/data.length});
	axes.push({axis: "PPM", value: ppm/data.length});

	d.axes = axes;
	data_final.push(d);
	console.log(data_final);
	return data_final;
}
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
	//determine right away max and min values for scales by filtering the data


////////////////////////////////////////////
///////////// Create the svg container /////
////////////////////////////////////////////
	const parent = d3.select(".radarChart");

	var svg = parent.append("svg")
			.attr("width", w + margin.left + margin.right)
			.attr("height", h + margin.top + margin.bottom)
			.attr("class", "radar");


	g = svg.append("g")
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
	maxSalary = 30453805
	var SalaryScale = d3.scaleLinear()
		.range([0, radius])
		.domain([minSalary, maxSalary]);


	//Scale for height
	maxHeight = 228.6;
	var HeightScale = d3.scaleLinear()
		.range([0, radius])
		.domain([minHeight, maxHeight]);


	//Scale for weight
	maxWeight = 163.44;
	var WeightScale = d3.scaleLinear()
		.range([0, radius])
		.domain([minWeight, maxWeight]);


	//Scale for the PPM
	maxPPM = 1.5;
	var PPMScale = d3.scaleLinear()
		.range([0, radius])
		.domain([minPPM, maxPPM]);


	//Scale for PPG
	maxPPG = 29.75;
	var PPGScale = d3.scaleLinear()
		.range([0, radius])
		.domain([minPPG, maxPPG]);


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
	console.log(maxSalary, maxPPG, maxHeight, maxWeight, maxPPM)
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
	//maxSalary = d3.max(new_data, function(d){ return d.axes[0].value});
	//console.log(maxSalary);
	

	/*new_data = transformData(data_radar
			.filter(function(d){ return d.Season == season_filter;})
			.filter(function(d){ return d.Team == team_filter;})
			.filter(function(d){ return d.Player == player1_filter}));
	////////////////////////////////////////////////////////
	findMinMax(data_radar.filter(function(d){ return d.Season == season_filter}));

	console.log(maxSalary, maxPPG, maxHeight, maxWeight, maxPPM);
	new_data_aux = getTeamAverage(data_radar.
			filter(function(d){ return d.Season == season_filter;}).
			filter(function(d){ return d.Team == team_filter;}));
	
	console.log(d3.max(new_data_aux, function(d){return d.axes[0]}));
	blobWrapper = g.selectAll(".radarWrapper")
		.data(new_data_aux)
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
		.data(new_data_aux)
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
	dispatch_radar.on("player", function(){
		changeRadar("player");
	});

	dispatch_radar.on("team", function() {
		changeRadar("team");
	})

	function changeRadar(option){

		if (option == "team") {
			new_data_aux = transformData(data_radar
				.filter(function(d){ return d.Season == season_filter;})
				.filter(function(d){ return d.Team == team_filter;}));

			new_data = getTeamAverage(data_radar
				.filter(function(d){ return d.Season == season_filter;})
				.filter(function(d){ return d.Team == team_filter;}));

		}

		if (option == "player") {
				new_data = transformData(data_radar
					.filter(function(d){ return d.Season == season_filter;})
					.filter(function(d){ return d.Team == team_filter;})
					.filter(function(d){ return d.Player == player1_filter;}));
		}

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
				.style("fill-opacity", 0.4) //opacity area
		//Create the outlines
		g.selectAll(".radarStroke")//.append("path")
		.data(new_data)
		.transition().duration(1000)
			//.attr("class", "radarStroke")
			.attr("d", function(d,i) { return radarLine(d.axes); })
			.style("stroke-width", outline_width + "px")
			.style("stroke", (d,i) => teamColor(d.Team, 2))
			.style("fill", "none")
			.style("filter" , "url(#glow)");
	
		//Append the outline circles
		g.selectAll(".radarWrapper")
			.data(new_data)
			.selectAll(".radarCircle")
			//.data(new_data)
			.data(d => d.axes)
			//.enter()
			.transition().duration(1000)
			//.append("circle")
			.attr("class", "radarCircle")
			.attr("r", outline_dots_radius)
			.attr("cx", (d,i) => eval(allAxis[i] + "Scale")(d.value) * cos(angleSlice * i - HALF_PI))
			.attr("cy", (d,i) => eval(allAxis[i] + "Scale")(d.value) * sin(angleSlice * i - HALF_PI))
			.style("fill", (d) => teamColor(team_filter, 1))
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