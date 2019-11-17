/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
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

function changeIdioms(e){
 document.getElementById("myInput").value = e.innerText
 team_filter = e.innerText;

}

var slider = new Slider("#ex13", {
  ticks: [0, 100, 200, 300, 400],
  ticks_labels: ['$0', '$100', '$200', '$300', '$400'],
  ticks_snap_bounds: 30
});