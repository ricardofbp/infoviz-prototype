/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

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
