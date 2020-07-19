"use strict";

/* commonly used functions */

function isString(s) {
  return ( typeof s === 'string' || s instanceof String );
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
  document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
  if (sel) {                                      // If a selection existed before copying
    document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
    document.getSelection().addRange(sel);        // Restore the original selection
  }

  // animate the copy button
  if ( btn ) {
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
  el.style.left = '-9999px';                      // Move outside the screen to make it invisible
  document.body.appendChild(el);                  // Append the textarea element to the HTML document
  copyContentToClipboard(el, btn);
  document.body.removeChild(el);                  // Remove the <textarea> element
}


// show or hide an element or a set of elements
// `sel` can be '.myclass', '#myid' or 'TAG'
function showOrHide(sel, show) {
  var x = sel, i;
  if ( isString(sel) ) x = S_(sel);
  if ( !x && x.length === 0 ) {
    return;
  }
  for ( i = 0; i < x.length; i++ ) {
    x[i].style.display = (show ? "" : "none");
  }
}

// toggle (show or hide) a set of elements selected by `sel`
// `btn` can be a btton element or its id, whose innerHTML starts with "显示" or "隐藏"
// `sel` can be '.myclass', '#myid' or 'TAG'
function btnToggle(sel, btn) {
  if ( isString(btn) ) {
    btn = document.getElementById(btn); // from id to element
  }
  var txt = btn.innerHTML.trim();
  if ( txt.slice(0,2) === "显示" ) {
    showOrHide(sel, true);
    btn.innerHTML = "隐藏" + txt.slice(2);
  } else {
    showOrHide(sel, false);
    btn.innerHTML = "显示" + txt.slice(2);
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
function shortenURL(url, type, callbackFunc)
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
      }
    }
  };
  var cmd = 'https://app.bhffer.com/urlshortener.php?', opts = [];
  if ( type !== null && type !== undefined ) {
    opts.push( 'type=' + encodeURIComponent(type) );
  }
  opts.push( 'url=' + encodeURIComponent(url) );
  cmd += opts.join('&');
  xmlhttp.open("GET", cmd, true);
  xmlhttp.send();
}



