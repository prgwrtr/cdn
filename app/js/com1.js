"use strict";

/* commonly used functions */

function isString(s) {
  return ( typeof s === 'string' || s instanceof String );
}

// add support to string.trim() for old browsers
if ( typeof String.prototype.trim !== 'function' ) {
  String.prototype.trim = function() {
    // for multi-line match also use the modifier `m`
    // e.g. "  aaa   \n bbb \nc" will be "aaa\nbbb\nc"
    return this.replace(/^\s+|\s+$/g, '');
  }
}

// https://stackoverflow.com/a/11381730/13612859
function isMobileDevice() {
  var a = (navigator.userAgent||navigator.vendor||window.opera);
  return ( /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)) );
}

// basic selector
// `sel` can be '.myclass', '#myid' or 'TAG'
// return an array of elements compatible with `sel`
function S_(sel)
{
  var x, c = sel.charAt(0);
  if ( c === '.' ) { // class selector
    x = document.getElementsByClassName(sel.slice(1));
  } else if ( c === '#' ) { // id selector
    x = document.getElementById(sel.slice(1));
    if ( x ) {
      return [x,];
    } else {
      return [];
    }
  } else {
    x = document.getElementsByTagName(sel.toUpperCase());
  }
  return x;
}

// basic animation: show and hide an element
// `script` is [0th-opacity, duration, 1st-opacity, duration, 2nd-opacity...]
function animateShow(el, script) {
  if ( isString(el) ) {
    el = document.getElementById(el);
  }
  var animId; // id from setInterval()
  var dt = 10; // time interval for animation in ms
  var stage = 0, nstages = Math.floor(script.length / 2);
  var istep = 0, nsteps, op0, op1;
  var setupStage = function() {
    istep = 0;
    nsteps = Math.floor( script[stage*2+1]/dt );
    op0 = script[stage*2];
    op1 = script[stage*2+2];
    el.style.opacity = op0;
  };
  setupStage(stage);
  if ( el.style.display === "none" ) {
    el.style.display = ""; // show the element if it is hidden
  }
  var showFrame = function() {
    if ( ++istep > nsteps ) { // go to the next stage
      if ( ++stage >= nstages ) {
        // all stages are completed
        clearInterval(animId);
        // hide the element if the last opacity is 0
        if ( op1 <= 0 ) el.style.display = "none";
      } else {
        setupStage(stage);
      }
    }
    // set the current opacity
    el.style.opacity = op0 + (op1 - op0)*istep/nsteps;
  };
  animId = setInterval(showFrame, dt);
}


// copy the content of a textarea/input element to the clipboard
// https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
function copyContentToClipboard(el, btn)
{
  if ( isString(el) ) el = document.getElementById(el);
  var sel;
  if ( document.getSelection().rangeCount > 0 ) { // Check if there is any content selected previously
    sel = document.getSelection().getRangeAt(0);  // Store selection if found
  } else {
    sel = false;                                  // Mark as false to know no selection existed before
  }
  // Select the <textarea> content
  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
    // convert to editable with readonly to stop iOS keyboard opening
    el.contentEditable = true;
    el.readOnly = true;

    // create a selectable range
    var range = document.createRange();
    range.selectNodeContents(el);

    // select the range
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    el.setSelectionRange(0, 999999);
  } else {
    el.select();
  }
  var succeeded = undefined;
  try {
    succeeded = document.execCommand('copy');     // Copy - only works as a result of a user action (e.g. click events)
  } catch(err) {
    succeeded = false;
  }
  if (sel) {                                      // If a selection existed before copying
    document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
    document.getSelection().addRange(sel);        // Restore the original selection
  }

  // animate the copy button
  if ( succeeded && btn ) {
    animateShow(btn, [1.0, 300, 0.5, 200, 0.5, 500, 1.0]);
  }
}

// copy a string to the clipboard
// https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
function copyTextToClipboard(s, btn)
{
  var el = document.createElement('TEXTAREA');    // Create a textarea element
  el.value = s;                                   // Set its value to the string that you want copied
  el.style.position = 'absolute';
  var isRTL = (document.documentElement.getAttribute('dir') == 'rtl');
  if ( isRTL ) {
    el.style.right = '-9999px';                      // Move outside the screen to make it invisible
  } else {
    el.style.left = '-9999px';                      // Move outside the screen to make it invisible
  }
  el.readonly = '';
  document.body.appendChild(el);                  // Append the textarea element to the HTML document
  copyContentToClipboard(el, btn);
  document.body.removeChild(el);                  // Remove the <textarea> element
}


// show or hide an element or a set of elements
// `sel` can be '.myclass', '#myid' or 'TAG'
function showOrHide(sel, show) {
  var x = sel, i, v;
  if ( isString(sel) ) x = S_(sel);
  if ( !x && x.length === 0 ) {
    return;
  }
  for ( i = 0; i < x.length; i++ ) {
    if ( show === "toggle" ) {
      v = x[i].style.display;
      x[i].style.display = ( v === "none" ? "" : "none" );
    } else {
      x[i].style.display = (show ? "" : "none");
    }
  }
}

// toggle (show or hide) a set of elements selected by `sel`
// `btn` can be a btton element or its id, whose innerHTML starts with "显示" or "隐藏"
// `sel` can be '.myclass', '#myid' or 'TAG'
function btnToggle(sel, btn) {
  if ( isString(btn) ) {
    btn = document.getElementById(btn); // from id to element
  }
  var txt = btn.innerHTML.trim(), t2 = txt.slice(0,2);
  if ( t2 === "显示" ) {
    showOrHide(sel, true);
    btn.innerHTML = "隐藏" + txt.slice(2);
  } else if ( t2 === "隐藏" ) {
    showOrHide(sel, false);
    btn.innerHTML = "显示" + txt.slice(2);
  } else {
    showOrHide(sel, "toggle");
  }
}

function createXMLHttp()
{
  if ( window.XMLHttpRequest ) {
    return new XMLHttpRequest();
  } else { // for IE5 and IE6
    return new ActiveXObject("Microsoft.XMLHTTP");
  }
}

// AJAX URL shortener
function shortenURL(url, type, callbackFunc, phpScriptPath)
{
  var xmlhttp = createXMLHttp();
  xmlhttp.onreadystatechange = function() {
    if ( xmlhttp.readyState == 4 // ready
      && xmlhttp.status == 200 ) { // OK
      // the url has been shortened
      var resp = xmlhttp.responseText;
      if ( resp.slice(0, 5).toLowerCase() !== "error" ) {
        var surl = resp; // if no error, response is url
        callbackFunc(resp);
      } else {
        console.log("shortenURL() failed\nURL: " + url + "\n"
          + "Type: " + type + "\n"
          + "Path: " + phpScriptPath + "\n" + resp);
      }
    }
  };

  var cmd = "", opts = [];
  var knowServers = [/bhffer\.com/, /xl.*\.com/, /localhost:/]
  var defPhpScriptPath = "https://app.bhffer.com/";
  if ( phpScriptPath === undefined ) {
    phpScriptPath = defPhpScriptPath;
    var m = /^(http.*\/|localhost:.*\/).*?[.](htm|php)/.exec(location.href), p, j;
    if ( m != null ) {
      p = m[1]; // tentative server path
      //console.log("tentative server path "+ p);
      // check if the path is one that has a PHP server
      for ( j = 0; j < knowServers.length; j++ ) {
        if ( knowServers[j].test(p) ) {
          //console.log("confirmed: " + knowServers[j] + " - " + p);
          phpScriptPath = p;
          break;
        }
      }
    }
  }
  // append a slash if needed
  if ( phpScriptPath.charAt(phpScriptPath.length-1) !== "/" ) {
    phpScriptPath += "/";
  }
  var cmd = phpScriptPath + 'urlshortener.php?', opts = [];
  if ( type !== null && type !== undefined ) {
    opts.push( 'type=' + encodeURIComponent(type) );
  }
  opts.push( 'url=' + encodeURIComponent(url) );
  cmd += opts.join('&');
  xmlhttp.open("GET", cmd, true);
  xmlhttp.send();
}



