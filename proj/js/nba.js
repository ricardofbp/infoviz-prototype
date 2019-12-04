/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

/* TODO REMOVE SECONDARY COLOR, CHANGE PRIMARY COLOR, ADD COORDS*/
var teamColors = 
[
  {team: "Atlanta Hawks", color1: "#E03A3E", color2: "#C1D32F", lat: 33.247875, long: -83.441162},
  {team: "Boston Celtics", color1: "#007A33", color2: "#BA9653", lat: 42.407211, long: -71.382439},
  {team: "Brooklyn Nets", color1: "#000000", color2: "#FFFFFF"},
  {team: "Charlotte Hornets", color1: "#1d1160", color2: "#00788C", lat: 35.782169, long: -80.793457},
  {team: "Chicago Bulls", color1: "#CE1141", color2: "#000000", lat: 40.000000, long: -89.000000},
  {team: "Cleveland Cavaliers" , color1: "#860038" , color2: "#041E42", lat: 40.367474, long: -82.996216},
  {team: "Dallas Mavericks", color1: "#00538C", color2: "#B8C4CA"},
  {team: "Denver Nuggets", color1: "#0E2240", color2: "#FEC524", lat: 39.113014, long: -105.358887},
  {team: "Detroit Pistons", color1: "#C8102E", color2: "#1d42ba", lat: 44.182205, long: -84.506836},
  {team: "Golden State Warriors", color1: "#1D428A", color2: "#ffc72c"},
  {team: "Houston Rockets", color1: "#CE1141", color2: "#000000"},
  {team: "Indiana Pacers", color1: "#002D62", color2: "#FDBB30", lat: 40.273502, long: -86.126976},
  {team: "Los Angeles Clippers", color1: "#c8102E", color2: "#1d428a" },
  {team: "Los Angeles Lakers", color1: "#552583" , color2: "#FDB927" },
  {team: "Memphis Grizzlies", color1: "#5D76A9", color2: "#12173F", lat: 35.860119, long: -86.660156},
  {team: "Miami Heat", color1: "#98002E", color2: "#F9A01B"},
  {team: "Milwaukee Bucks", color1: "#00471B", color2: "#EEE1C6", lat: 44.500000, long: -89.500000},
  {team: "Minnesota Timberwolves", color1: "#0C2340", color2: "#236192", lat: 46.392410, long: -94.636230},
  {team: "New Orleans Pelicans", color1: "#0C2340", color2: "#C8102E", lat: 30.391830, long: -92.329102},
  {team: "New York Knicks", color1: "#006BB6", color2: "#F58426"},
  {team: "Oklahoma City Thunders", color1: "#007ac1", color2: "#ef3b24", lat: 36.084621, long: -96.921387},
  {team: "Orlando Magic", color1: "#0077c0", color2: "#C4ced4"},
  {team: "Philadelphia 76ers", color1: "#006bb6", color2: "#ed174c", lat: 41.203323, long: -77.194527},
  {team: "Phoenix Suns", color1: "#1d1160", color2: "#e56020", lat: 34.048927, long: -111.093735},
  {team: "Portland Trail Blazers", color1: "#E03A3E", color2: "#000000", lat: 44.000000, long: -120.500000},
  {team: "Sacramento Kings", color1: "#5a2d81", color2: "#63727A"},
  {team: "San Antonio Spurs", color1: "#c4ced4", color2: "#000000"},
  {team: "Toronto Raptros", color1: "#ce1141", color2: "#000000"},
  {team: "Utah Jazz", color1: "#002B5C", color2: "#00471B", lat: 39.419220, long: -111.950684},
  {team: "Washington Wizards", color1: "#002B5C", color2: "#e31837", lat: 47.751076, long: -120.740135}
]
/* IN THE MAKING
var stateCoords = 
[
{name: Wisconsin, lat: 44.500000, long: -89.500000},
{West Virginia, 39.000000 -80.500000},
{Vermont, 44.000000 -72.699997},
{Texas, 31.000000 -100.000000},
{South Dakota, 44.500000 -100.000000},
{Rhode Island, 41.700001 -71.500000},
{name: Oregon, lat: 44.000000, long: -120.500000},
{New York, 43.000000 -75.000000},
{New Hampshire, 44.000000 -71.500000},
{Nebraska, 41.500000 -100.000000},
{Kansas, 38.500000 -98.000000},
{Mississippi, 33.000000 -90.000000},
{name, Illinois, lat: 40.000000, long: -89.000000},
{Delaware, 39.000000 -75.500000},
{Connecticut, 41.599998 -72.699997},
{Arkansas, 34.799999 -92.199997},
{name: Indiana, lat: 40.273502, long: -86.126976},
{Missouri State, 38.573936 -92.603760},
{Florida, 27.994402 -81.760254},
{Nevada, 39.876019 -117.224121},
{Maine, 45.367584 -68.972168},
{name: Michigan, lat: 44.182205, long: -84.506836},
{name: Georgia, lat: 33.247875, long: -83.441162},
{Hawaii, 20.716179 -158.214676},
{Alaska, 66.160507 -153.369141},
{name: Tennessee, lat: 35.860119, long: -86.660156},
{Virginia, 37.926868 -78.024902},
{New Jersey, 39.833851 -74.871826},
{Kentucky, 37.839333 -84.270020},
{North Dakota, 47.650589 -100.437012},
{name: Minnesota, lat: 46.392410, long: -94.636230},
{name: Oklahoma, lat: 36.084621, long: -96.921387},
{Montana, 46.965260 -109.533691},
{name: Washington, lat: 47.751076, long: -120.740135},
{name: Utah, lat: 39.419220, long: -111.950684},
{name: Colorado, lat: 39.113014, long: -105.358887},
{name: Ohio, lat: 40.367474, long: -82.996216},
{Alabama, 32.318230 -86.902298},
{Iowa, 42.032974 -93.581543},
{New Mexico, 34.307144 -106.018066},
{South Carolina, 33.836082 -81.163727},
{name: Pennsylvania, lat: 41.203323, long: -77.194527},
{name: Arizona, lat: 34.048927, long: -111.093735},
{Maryland, 39.045753 -76.641273},
{name, Massachusetts, lat: 42.407211, long: -71.382439},
{California, 36.778259 -119.417931},
{Idaho, 44.068203 -114.742043},
{Wyoming, 43.075970 -107.290283},
{name: North Carolina, lat: 35.782169, long: -80.793457},
{name: Louisiana, lat: 30.391830, long: -92.329102}
]
*/
var team_filter = "Atlanta Hawks"; 
var player1_filter = "Wayne Turner";

var teamFilters = [];
var playerFilters = [];
var season_filter = 2000;

var dispatch_scatter = d3.dispatch("year", "removeTeam", "addTeam", "ampPlayer", "deAmpPlayer");   //two functions can be called when dispatch is called
var dispatch_radar = d3.dispatch("year", "removeTeam", "addTeam", "addPlayer", "removePlayer");
var dispatch_parallel = d3.dispatch("year", "addTeam", "removeTeam");

var slider;

function init() {

  console.log("[INFO] INIT EVERYTHING");
  teamFilters.push("Atlanta Hawks");
  dispatch_radar.call("addTeam", this, "Atlanta Hawks");
  dispatch_scatter.call("addTeam", this, "Atlanta Hawks");
  dispatch_radar.call("year");
  dispatch_scatter.call("year");
  document.getElementById("Atlanta Hawks").style.backgroundColor = "gray";
}

function teamColor(teamName, type) {
    for (let i = 0; i < teamColors.length; i++) {
        if (teamColors[i].team == teamName) { 
            //console.log(item.color);
            if (type == 1) return teamColors[i].color1; 
            if (type == 2) return teamColors[i].color2; 
        }
    }
    //black is returned if something bad happens
    return "#000000";
}

function team_dropdown() {
  document.getElementById("team_dropdown").classList.toggle("show");
}

function player1_dropdown(){
  //console.log(new_data);
  document.getElementById("player1_dropdown").classList.toggle("show");
}

function filterFunction_team() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("teamInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("team_dropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

function filterFunction_player() {
	var input, filter, ul, li, a, i;
	input = document.getElementById("playerInput1");
	filter = input.value.toUpperCase();
	div = document.getElementById("player1_dropdown");
	a = div.getElementsByTagName("a");
	for (i = 0; i < a.length; i++) {
	  txtValue = a[i].textContent || a[i].innerText;
	  if (txtValue.toUpperCase().indexOf(filter) > -1) {
		a[i].style.display = "";
	  } else {
		a[i].style.display = "none";
	  }
	}
  }

var original_value = 2000;

function start_slider(){
  var slider = new Slider("#year", {
    ticks: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
    ticks_snap_bounds: 30,
    ticks_labels: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
  });

  slider.on('slideStart', function(value){
      original_value = document.getElementById("year").value;
  });

  slider.on('slideStop', function(value){
      var new_val = document.getElementById("year").value;
      if(original_value != new_val){
        season_filter = new_val;
      }
      dispatch_radar.call("year");
      dispatch_scatter.call("year");
      updatePlayerDropdown();

    });
}

//to be used in scatter
//will need to be changed to "match" the changeTeam, as we have a dropdown for players
function changePlayers(playerName, playerTeam) {
  console.log("[INFO] changePlayers " + playerName + " " + playerTeam);
  document.getElementById("radarchart-title").innerText = "Player Attributes";
  for (let i = 0; i < playerFilters.length; i++) {
    if (playerFilters[i] == playerName) {
      console.log("[INFO] changePlayers removing" + playerName + " " + playerTeam);
      dispatch_radar.call("removePlayer", this, playerFilters[i], playerTeam);
      playerFilters.splice(i,1);
      //TODO change dropdown
      return;
    }
  }

  console.log("[INFO] changePlayers adding");
  playerFilters.push(playerName);
  dispatch_radar.call("addPlayer", this, playerName, playerTeam);

}



function changeTeam(e) {
 //if (teamFilters.length == 1) { return; } //meaning, we show at least 1 team
    team_dropdown();
  for (let i = 0; i < teamFilters.length; i++) {
    console.log("[INFO] changeTeam for " + i);
    document.getElementById("radarchart-title").innerText = "Teams Average Attributes";
    if (teamFilters[i] == e.innerText) { //clicked team is selected
      //TODO dispatch for parallel
      dispatch_radar.call("removeTeam", this, teamFilters[i]);
      dispatch_scatter.call("removeTeam", this, teamFilters[i]);
      console.log("[INFO] changeTeam deselect");
      teamFilters.splice(i,1); //removes 1 element from current position <=> removing selected team
      e.style.backgroundColor = "#f6f6f6"
      team_dropdown();
      return;
    }
  }

  console.log("[INFO] changeTeam select");
  teamFilters.push(e.innerText);
  //TODO dispatch for parallel
  dispatch_radar.call("addTeam", this, e.innerText);
  dispatch_scatter.call("addTeam", this, e.innerText);
  e.style.backgroundColor = "gray";
}

function changeTeams(team) {
  for (let i = 0; i < teamFilters.length; i++) {
    console.log("[INFO] changeTeam for " + i);
    document.getElementById("radarchart-title").innerText = "Teams Average Attributes";
    if (teamFilters[i] == team) { //clicked team is selected
      //TODO dispatch for parallel
      dispatch_radar.call("removeTeam", this, teamFilters[i]);
      dispatch_scatter.call("removeTeam", this, teamFilters[i]);
      console.log("[INFO] changeTeam deselect");
      teamFilters.splice(i,1); //removes 1 element from current position <=> removing selected team
      return;
    }
  }

  console.log("[INFO] changeTeam select");
  teamFilters.push(team);
  //TODO dispatch for parallel
  dispatch_radar.call("addTeam", this, team);
  dispatch_scatter.call("addTeam", this, team);
}

function updatePlayerDropdown(){
	var element;
	var linkTest;

	//First remove if there are players already being shown
	var drop = document.getElementById("player1_dropdown");
	while(drop.childElementCount != 1){
		drop.removeChild(drop.lastChild);
	}
	//update the players' list
	for(var i = 0; i < new_data_aux.length; i++){
		//console.log(new_data[i].Player);
		element = document.createElement('a');
		linkTest = document.createTextNode(new_data_aux[i].Player);
		element.appendChild(linkTest);
    element.id = "p-" + new_data_aux[i].Team;
		element.href = "#" + new_data_aux[i].Player;
    //console.log(element.id);
		element.onclick = function(){changePlayer1(this)};
		//console.log(element);
		drop.appendChild(element);
		
  }
}

function changePlayer1(e){
  console.log("changePlayer1" + player1_filter);
	player1_filter = e.innerHTML;
  dispatch_radar.call("player");
  player1_dropdown();
  
}
