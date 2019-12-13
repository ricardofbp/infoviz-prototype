/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

/* TODO REMOVE SECONDARY COLOR, CHANGE PRIMARY COLOR, ADD COORDS*/
var teamColors = 
[
  {team: "Atlanta Hawks", color1: "#E03A3E", color2: "#C1D32F", lat: 33.247875, long: -83.441162},
  {team: "Boston Celtics", color1: "#007A33", color2: "#BA9653", lat: 42.407211, long: -71.382439},
  {team: "Brooklyn Nets", color1: "#000000", color2: "#FFFFFF", lat: 43.000000, long: -75.000000},
  {team: "Charlotte Hornets", color1: "#1d1160", color2: "#00788C", lat: 35.782169, long: -80.793457},
  {team: "Chicago Bulls", color1: "#CE1141", color2: "#000000", lat: 40.000000, long: -89.000000},
  {team: "Cleveland Cavaliers" , color1: "#860038" , color2: "#041E42", lat: 40.367474, long: -82.996216}, 
  {team: "Dallas Mavericks", color1: "#00538C", color2: "#B8C4CA", lat: 29.000000, long: -98.500000},
  {team: "Denver Nuggets", color1: "#0E2240", color2: "#FEC524", lat: 39.113014, long: -105.358887},
  {team: "Detroit Pistons", color1: "#C8102E", color2: "#1d42ba", lat: 44.182205, long: -84.506836},
  {team: "Golden State Warriors", color1: "#1D428A", color2: "#ffc72c", lat: 37.778259, long: -120.417931},
  {team: "Houston Rockets", color1: "#CE1141", color2: "#000000", lat: 32.500000, long: -101.000000},
  {team: "Indiana Pacers", color1: "#002D62", color2: "#FDBB30", lat: 40.273502, long: -86.126976},
  {team: "Los Angeles Clippers", color1: "#c8102E", color2: "#1d428a", lat: 34.278259, long: -116.500000 },
  {team: "Los Angeles Lakers", color1: "#552583" , color2: "#FDB927", lat: 35.778259, long: -118.417931},
  {team: "Memphis Grizzlies", color1: "#5D76A9", color2: "#12173F", lat: 35.860119, long: -86.660156}, 
  {team: "Miami Heat", color1: "#98002E", color2: "#F9A01B", lat: 26.994402, long: -80.760254},
  {team: "Milwaukee Bucks", color1: "#00471B", color2: "#EEE1C6", lat: 44.500000, long: -89.500000},
  {team: "Minnesota Timberwolves", color1: "#0C2340", color2: "#236192", lat: 46.392410, long: -94.636230},
  {team: "New Orleans Pelicans", color1: "#0C2340", color2: "#C8102E", lat: 30.391830, long: -92.329102}, //?
  {team: "New York Knicks", color1: "#006BB6", color2: "#F58426", lat: 45.000000,long: -75.000000},
  {team: "Oklahoma City Thunder", color1: "#007ac1", color2: "#ef3b24", lat: 36.084621, long: -96.921387}, 
  {team: "Orlando Magic", color1: "#0077c0", color2: "#C4ced4", lat: 28.999402, long: -81.760254},
  {team: "Philadelphia 76ers", color1: "#006bb6", color2: "#ed174c", lat: 40.93323, long: -77.894527},
  {team: "Phoenix Suns", color1: "#1d1160", color2: "#e56020", lat: 34.048927, long: -111.093735},
  {team: "Portland Trail Blazers", color1: "#E03A3E", color2: "#000000", lat: 44.000000, long: -120.500000},
  {team: "Sacramento Kings", color1: "#5a2d81", color2: "#63727A", lat: 40.378259, long: -122.017931},
  {team: "San Antonio Spurs", color1: "#c4ced4", color2: "#000000", lat: 32.000000, long: -96.000000},
  {team: "Toronto Raptors", color1: "#ce1141", color2: "#000000", lat: 43.651070, long: -80.347015},
  {team: "Utah Jazz", color1: "#002B5C", color2: "#00471B", lat: 39.419220, long: -111.950684},
  {team: "Washington Wizards", color1: "#002B5C", color2: "#e31837", lat: 47.751076, long: -120.740135}
];

var colorScale =
["#94537b",
"#56c15e",
"#9c50c7",
"#87bb37",
"#5e69d8",
"#b9ae39",
"#d547ad",
"#4c8b29",
"#d57de1",
"#40854a",
"#dd4481",
"#58c49c",
"#d43e4a",
"#4ebcd9",
"#ce5126",
"#5895db",
"#dd9230",
"#5166a6",
"#757421",
"#8756a5",
"#9eb56c",
"#a93f88",
"#2e8871",
"#df7a5b",
"#a696e0",
"#9b5f2a",
"#dd86b7",
"#6d733b",
"#a64556",
"#d2a165",
"#dd7d7f"]

var states = 
[
  {
    "state":"Alaska",
    "latitude":61.3850,
    "longitude":-152.2683
  },
  {
    "state":"Alabama",
    "latitude":32.7990,
    "longitude":-86.8073
  },
  {
    "state":"Arkansas",
    "latitude":34.9513,
    "longitude":-92.3809
  },
  {
    "state":"Arizona",
    "latitude":33.7712,
    "longitude":-111.3877
  },
  {
    "state":"California",
    "latitude":36.1700,
    "longitude":-119.7462
  },
  {
    "state":"Colorado",
    "latitude":39.0646,
    "longitude":-105.3272
  },
  {
    "state":"Connecticut",
    "latitude":41.5834,
    "longitude":-72.7622
  },
  {
    "state":"Delaware",
    "latitude":39.3498,
    "longitude":-75.5148
  },
  {
    "state":"Florida",
    "latitude":27.8333,
    "longitude":-81.7170
  },
  {
    "state":"Georgia",
    "latitude":32.9866,
    "longitude":-83.6487
  },
  {
    "state":"Hawaii",
    "latitude":21.1098,
    "longitude":-157.5311
  },
  {
    "state":"Iowa",
    "latitude":42.0046,
    "longitude":-93.2140
  },
  {
    "state":"Idaho",
    "latitude":44.2394,
    "longitude":-114.5103
  },
  {
    "state":"Illinois",
    "latitude":40.3363,
    "longitude":-89.0022
  },
  {
    "state":"Indiana",
    "latitude":39.8647,
    "longitude":-86.2604
  },
  {
    "state":"Kansas",
    "latitude":38.5111,
    "longitude":-96.8005
  },
  {
    "state":"Kentucky",
    "latitude":37.6690,
    "longitude":-84.6514
  },
  {
    "state":"Louisiana",
    "latitude":31.1801,
    "longitude":-91.8749
  },
  {
    "state":"Massachusetts",
    "latitude":42.2373,
    "longitude":-71.5314
  },
  {
    "state":"Maryland",
    "latitude":39.0724,
    "longitude":-76.7902
  },
  {
    "state":"Maine",
    "latitude":44.6074,
    "longitude":-69.3977
  },
  {
    "state":"Michigan",
    "latitude":43.3504,
    "longitude":-84.5603
  },
  {
    "state":"Minnesota",
    "latitude":45.7326,
    "longitude":-93.9196
  },
  {
    "state":"Missouri",
    "latitude":38.4623,
    "longitude":-92.3020
  },
  {
    "state":"Mississippi",
    "latitude":32.7673,
    "longitude":-89.6812
  },
  {
    "state":"Montana",
    "latitude":46.9048,
    "longitude":-110.3261
  },
  {
    "state":"North Carolina",
    "latitude":35.6411,
    "longitude":-79.8431
  },
  {
    "state":"North Dakota",
    "latitude":47.5362,
    "longitude":-99.7930
  },
  {
    "state":"Nebraska",
    "latitude":41.1289,
    "longitude":-98.2883
  },
  {
    "state":"New Hampshire",
    "latitude":43.4108,
    "longitude":-71.5653
  },
  {
    "state":"New Jersey",
    "latitude":40.3140,
    "longitude":-74.5089
  },
  {
    "state":"New Mexico",
    "latitude":34.8375,
    "longitude":-106.2371
  },
  {
    "state":"Nevada",
    "latitude":38.4199,
    "longitude":-117.1219
  },
  {
    "state":"New York",
    "latitude":42.1497,
    "longitude":-74.9384
  },
  {
    "state":"Ohio",
    "latitude":40.3736,
    "longitude":-82.7755
  },
  {
    "state":"Oklahoma",
    "latitude":35.5376,
    "longitude":-96.9247
  },
  {
    "state":"Oregon",
    "latitude":44.5672,
    "longitude":-122.1269
  },
  {
    "state":"Pennsylvania",
    "latitude":40.5773,
    "longitude":-77.2640
  },
  {
    "state":"Rhode Island",
    "latitude":41.6772,
    "longitude":-71.5101
  },
  {
    "state":"South Carolina",
    "latitude":33.8191,
    "longitude":-80.9066
  },
  {
    "state":"South Dakota",
    "latitude":44.2853,
    "longitude":-99.4632
  },
  {
    "state":"Tennessee",
    "latitude":35.7449,
    "longitude":-86.7489
  },
  {
    "state":"Texas",
    "latitude":31.1060,
    "longitude":-97.6475
  },
  {
    "state":"Utah",
    "latitude":40.1135,
    "longitude":-111.8535
  },
  {
    "state":"Virginia",
    "latitude":37.7680,
    "longitude":-78.2057
  },
  {
    "state":"Vermont",
    "latitude":44.0407,
    "longitude":-72.7093
  },
  {
    "state":"Washington",
    "latitude":47.3917,
    "longitude":-121.5708
  },
  {
    "state":"Wisconsin",
    "latitude":44.2563,
    "longitude":-89.6385
  },
  {
    "state":"West Virginia",
    "latitude":38.4680,
    "longitude":-80.9696
  },
  {
    "state":"Wyoming",
    "latitude":42.7475,
    "longitude":-107.2085
  }
]

var teamFilters = [];
var playerFilters = [];
var season_filter = 2000;
var old_season_filter;

var dispatch_scatter = d3.dispatch("year", "removeTeam", "addTeam", "ampPlayer", "deAmpPlayer");   //two functions can be called when dispatch is called
var dispatch_radar = d3.dispatch("year", "removeTeam", "addTeam", "addPlayer", "removePlayer");
var dispatch_parallel = d3.dispatch("year", "addTeam", "removeTeam", "ampTeam", "deAmpTeam");
var dispatch_map = d3.dispatch("year", "addTeam", "removeTeam", "ampTeam", "deAmpTeam");

var lineWidth = 3;
var fadingTransitionDuration = 200;
var slider;

function init() {
  var teamToInit = "Atlanta Hawks";
  changeTeams(teamToInit);
  d3.select(".mark." + teamToInit.replace(/\s+/g, ''))
    .style("outline",  "2px solid " + teamColor(teamToInit, 1));
  start_slider();
}

function teamColor(teamName, type) {
    for (let i = 0; i < teamColors.length; i++) {
        if (teamColors[i].team == teamName) { 
            return colorScale[i]
            //console.log(d3.interpolateTurbo(i/31))
        }
    }
    //black is returned if something bad happens
    return "#000000";
}

function getTeamCoords(team) {
  for (let i = 0; i < teamColors.length; i++) {
    if (teamColors[i].team == team) {
      return [teamColors[i].long, teamColors[i].lat]
    }
  }
}

function getStateCoords(state) {
  for (let i = 0; i < states.length; i++) {
    if (states[i].state == state) {
      return [states[i].longitude, states[i].latitude]
    }
  }
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
  console.log("START SLIDER")
  var slider = new Slider("#year", {
    ticks: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
    ticks_snap_bounds: 30,
    ticks_labels: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
  });

  slider.on('slideStart', function(value){
      original_value = document.getElementById("year").value;
  });

  slider.on('slideStop', function(value){
      document.getElementById("radarchart-title").innerText = "Teams Average Attributes";
      var new_val = document.getElementById("year").value;
      if(original_value != new_val){
        old_season_filter = season_filter;
        season_filter = new_val;
      }
      dispatch_radar.call("year");
      dispatch_scatter.call("year");
      dispatch_map.call("year");
      dispatch_parallel.call("year");
      updatePlayerDropdown();

    });
}

//to be used in scatter
//will need to be changed to "match" the changeTeam, as we have a dropdown for players
function changePlayers(playerName, playerTeam) {
  //console.log("[INFO] changePlayers " + playerName + " " + playerTeam);
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

  //console.log("[INFO] changePlayers adding");
  playerFilters.push(playerName);
  dispatch_radar.call("addPlayer", this, playerName, playerTeam);

}

function changeTeams(team) {
  for (let i = 0; i < teamFilters.length; i++) {
    //console.log("[INFO] changeTeam for " + i);
    document.getElementById("radarchart-title").innerText = "Teams Average Attributes";
    if (teamFilters[i] == team) { //clicked team is selected
      dispatch_radar.call("removeTeam", this, teamFilters[i]);
      dispatch_scatter.call("removeTeam", this, teamFilters[i]);
      dispatch_map.call("removeTeam", this, teamFilters[i]);
      dispatch_parallel.call("removeTeam", this, teamFilters[i]);
      console.log("[INFO] changeTeam deselect");
      teamFilters.splice(i,1); //removes 1 element from current position <=> removing selected team
      updatePlayerDropdown();
      return false;
    }
  }

  //console.log("[INFO] changeTeam select");
  teamFilters.push(team);
  dispatch_radar.call("addTeam", this, team);
  dispatch_scatter.call("addTeam", this, team)
  dispatch_map.call("addTeam", this, team);
  dispatch_parallel.call("addTeam", this, team);
  updatePlayerDropdown();
  return true;
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
  for (let i = 0; i < teamFilters.length; i++) {
    var team = teamFilters[i];
    console.log("UPDATED P DROP FOR " + team);
    var aux = data_scatter                
              .filter(function(d){ return d.season == season_filter; })
              .filter(function(d){ return d.team == team; });

    for(let j = 0; j < aux.length; j++){
      var playerName = aux[j].name;
      //console.log(new_data[i].Player);
      element = document.createElement('a');
      element.className = team;
      linkTest = document.createTextNode(playerName);
      element.appendChild(linkTest);
      //element.id = "p-" + new_data_aux[i].Team;
      element.href = "#" + playerName;
      console.log("DROPDOWN PLAYER: " + playerName + " " + team);
      element.onclick = function(){
        changePlayers(this.innerText, this.className);
      };
      //console.log(element);
      drop.appendChild(element);
      }
  }
}

function changeTeam(element){
  console.log()
}

window.onload = function(){
  console.log("INIT")
    //init();
    var interval = setTimeout(init, 2000);
};
