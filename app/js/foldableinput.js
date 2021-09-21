"use strict";

function initFoldableInput(x, funcRefresh)
{
  var toggler = document.createElement("div");
  toggler.className = "toggler";
  x.insertBefore(toggler, x.childNodes[0]);

  var btn = document.createElement("button");
  toggler.appendChild(btn);
  btn.type = "button";
  btn.className = "toggler-btn";

  var svgs = {
    // https://icons.getbootstrap.com/icons/toggle-on/
    toggleOn: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-toggle-on" viewBox="0 0 16 16"> <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/> </svg>',
    // https://icons.getbootstrap.com/icons/toggle-off/
    toggleOff: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-toggle-off" viewBox="0 0 16 16"> <path d="M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z"/> </svg>',
  };
  var active = (x.className.indexOf("collapsed") < 0);
  btn.innerHTML = active ? svgs.toggleOn : svgs.toggleOff;

  btn.addEventListener("click", function() {
    var active = (x.className.indexOf("collapsed") < 0);
    if (active) {
      x.className += " collapsed";
      // currently toggled-off, clicking this button turns it on
      btn.innerHTML = svgs.toggleOff;
    } else {
      x.className = x.className.replace(/collapsed/g, "");
      // currently toggled-on, clicking this button turns it off
      btn.innerHTML = svgs.toggleOn;
    }
    //console.log(x.dataset);
    var toggleFunc = x.dataset.ontoggle;
    if (toggleFunc) {
      eval(toggleFunc);
    }
  });
}

// handle items with foldableSelector (.inp-foldable)
function initFoldableInputs(foldableSelector)
{
  var x = document.querySelectorAll(foldableSelector), i;
  for (i = 0; i < x.length; i++) {
    initFoldableInput(x[i]);
  }
}



