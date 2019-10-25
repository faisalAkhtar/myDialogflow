var msgDiv = document.getElementsByClassName('messageDivSmall');
var lgdDiv = document.getElementsByClassName('loggedDivSmall')[0];
var pplDiv = document.getElementsByClassName('peopleDivSmall')[0];
var msgs = document.getElementsByClassName('people');
var openedDiv = null;
var i=0;

function goBack(arg) {
  if(openedDiv=="peopleDiv" || arg=="peopleDiv") {
    for (;i<=1; i++) { window.location.reload(); }
    pplDiv.style.display = "block";
    for (var i = 0; i < msgDiv.length; i++) {
      msgDiv[i].style.display = "none";
    }
    lgdDiv.style.display = "none";
  } else if (openedDiv=="messageDiv") {
    pplDiv.style.display = "none";
    for (var i = 0; i < msgDiv.length; i++) {
      msgDiv[i].style.display = "block";
    }
    lgdDiv.style.display = "none";
  }
}

function openMenu(arg) {
  var i=0;
  openedDiv = arg;
  pplDiv.style.display = "none";
  for (var i = 0; i < msgDiv.length; i++) {
    msgDiv[i].style.display = "none";
  }
  lgdDiv.style.display = "block";

  var i = 0;
  for (; i < msgs.length-1; i++) { }
  msgs[i].scrollIntoView();
}

function openMessages() {
  var i=0;
  pplDiv.style.display = "none";
  for (var i = 0; i < msgDiv.length; i++) {
    msgDiv[i].style.display = "block";
  }
  lgdDiv.style.display = "none";
}

function resetDivs() {
  var i=0;
  if(window.innerWidth > 1279) {
    pplDiv.style.display = "block";
    for (var i = 0; i < msgDiv.length; i++) {
      msgDiv[i].style.display = "block";
    }
    lgdDiv.style.display = "block";
  }
}

window.addEventListener("resize", resetDivs);

window.onload = function() {
  if(window.innerWidth < 1279) {
    goBack('peopleDiv');
  }
}
