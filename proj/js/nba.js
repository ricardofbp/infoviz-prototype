/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
var teamColors = 
[
  {team: "Atlanta Hawks", color1: "#E03A3E", color2: "#C1D32F"},
  {team: "Boston Celtics", color1: "#007A33", color2: "#BA9653"},
  {team: "Brooklyn Nets", color1: "#000000", color2: "#FFFFFF"},
  {team: "Charlotte Hornets", color1: "#1d1160", color2: "#00788C"},
  {team: "Chicago Bulls", color1: "#CE1141", color2: "#000000"},
  {team: "Cleveland Cavaliers" , color1: "#860038" , color2: "#041E42"},
  {team: "Dallas Mavericks", color1: "#00538C", color2: "#B8C4CA"},
  {team: "Denver Nuggets", color1: "#0E2240", color2: "#FEC524"},
  {team: "Detroit Pistons", color1: "#C8102E", color2: "#1d42ba"},
  {team: "Golden State Warriors", color1: "#1D428A", color2: "#ffc72c"},
  {team: "Houston Rockets", color1: "#CE1141", color2: "#000000"},
  {team: "Indiana Pacers", color1: "#002D62", color2: "#FDBB30"},
  {team: "Los Angeles Clippers", color1: "#c8102E", color2: "#1d428a" },
  {team: "Los Angeles Lakers", color1: "#552583" , color2: "#FDB927" },
  {team: "Memphis Grizzlies", color1: "#5D76A9", color2: "#12173F"},
  {team: "Miami Heat", color1: "#98002E", color2: "#F9A01B"},
  {team: "Milwaukee Bucks", color1: "#00471B", color2: "#EEE1C6"},
  {team: "Minnesota Timberwolves", color1: "#0C2340", color2: "#236192"},
  {team: "New Orleans Pelicans", color1: "#0C2340", color2: "#C8102E"},
  {team: "New York Knicks", color1: "#006BB6", color2: "#F58426"},
  {team: "Oklahoma City Thunders", color1: "#007ac1", color2: "#ef3b24"},
  {team: "Orlando Magic", color1: "#0077c0", color2: "#C4ced4"},
  {team: "Philadelphia 76ers", color1: "#006bb6", color2: "#ed174c"},
  {team: "Phoenix Suns", color1: "#1d1160", color2: "#e56020"},
  {team: "Portland Trail Blazers", color1: "#E03A3E", color2: "#000000"},
  {team: "Sacramento Kings", color1: "#5a2d81", color2: "#63727A"},
  {team: "San Antonio Spurs", color1: "#c4ced4", color2: "#000000"},
  {team: "Toronto Raptros", color1: "#ce1141", color2: "#000000"},
  {team: "Utah Jazz", color1: "#002B5C", color2: "#00471B"},
  {team: "Washington Wizards", color1: "#002B5C", color2: "#e31837"}
]

var slider;

var dispatch = d3.dispatch("year");

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
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
     //dispatch.call("year");

    });

  slider.on('slideStop', function(value){
      var new_val = document.getElementById("year").value;
      if(original_value != new_val){
        season_filter = new_val;
      }
      dispatch.call("year");
    });
}

function changeIdioms(e){
 document.getElementById("myInput").value = e.innerText
 team_filter = e.innerText;
}
