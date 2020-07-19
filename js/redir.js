"use strict";

// encode a string
// calling this function twice gives the original back
function flipenc(s) {
  var i, n = s.length, t = "", c, p;
  var tab = "%/:?&=.monhtpqjJZz-_";
  for ( i = 0; i < n; i++ ) {
    var c = s.charAt(i);
    var p = tab.indexOf(c);
    if ( p >= 0 ) {
      c = tab.charAt(tab.length - 1 - p);
    }
    t = c + t;
    //console.log(i, s.charAt(i), c, p);
  }
  return t;
}

// https://bing.com/?q=hello
//var a1 = "http://yahoo.com?hi-lang=b.c_123", a2 = flipenc(a1), a3 = flipenc(a2);
//alert(a1 + " " + a2 + " " + a3);

function genLink()
{
  var s = location.href, outurl = s; // address bar
  var q = s.indexOf("?"); // look for "?"
  if ( q >= 0 ) outurl = s.slice(0, q);
  if ( outurl.indexOf("://localhost") >= 0
    || outurl.indexOf("file://") >= 0 ) {
    // fallback version of this webpage
    outurl = "https://jsbin.com/gayacob";
  }
  // if inline display (like frame.html) is need,
  // change https to http to avoid the mix content error
  //outurl = outurl.replace(/^https:/g, "http:");

  var url = document.getElementById("url").value;
  url = url.split("\n")[0]; // get the first line
  if ( url.slice(0,7) === "http://" ) { // drop http://
    url = url.slice(7);
  } else if (url.slice(0, 8) === "https://" ) {
    url = "~" + url.slice(8);
  }
  url = url.replace(/^\s+|\s+$/g, ""); // trim
  if ( url === "" ) return;
  var enc = document.getElementById("enc-link").checked;
  outurl += "?";
  if ( enc ) {
    outurl += "enc=1&";
    url = flipenc(url);
  }
  url = encodeURIComponent(url);
  outurl += "url=" + url;
  var a = document.getElementById("out-url");
  a.innerHTML = outurl;
  a.href = outurl;
}
/*
// things to do after the link is shortened
function linkShortened(surl)
{
  var el = document.getElementById("out-url");
  el.innerHTML = surl;
  el.href = surl;
  animateShow(el, [1.0, 700, 0.4, 500, 0.4, 800, 1.0]);
}

function shortenLink()
{
  var s = document.getElementById("out-url").href;
  // shortenURL() is defined in com1.js
  shortenURL(s, 'bit.ly', linkShortened);
}
*/
function copyLink(cpbtn) {
  var s = document.getElementById("out-url").href;
  copyTextToClipboard(s, cpbtn);
  animateShow("out-url", [1.0, 1000, 1.0, 700, 0.4, 500, 0.4, 800, 1.0]);
}

function showGenPanel(enc)
{
  // no url in address bar, show the generation panel
  document.getElementById("gen-panel").style.display = "";
  document.getElementById("gen-link").onclick = genLink;
  //document.getElementById("shorten-link").onclick = shortenLink;
  document.getElementById("copy-link").onclick =
    function() { copyLink(); }
}

function openURL(url, enc)
{
  // redirecting: decoding an existing encoded address
  url = decodeURIComponent(url);
  if ( enc ) {
    url = flipenc(url);
  }
  // prepend "http://" or "https://" if necessary
  if ( /(^[a-z]+:)?\/\//i.test(url) ) {
    if ( url.charAt(0) === "~" ) {
      url = "https://" + url.slice(1);
    } else {
      url = "http://" + url;
    }
  }
  document.getElementById("url").value = url;
  // check if the browser is Wechat
  if ( !window.navigator.userAgent.match(/MicroMessenger/i) ) { // if not wechat
    var ext = url.slice(url.length - 3).toLowerCase();
    window.location.href = url; // jump to the real address
  } else {
    document.getElementById("redir-panel").style.display = "";
  }
}

(function(){
  // main function
  var s, p, q, args, url = undefined, enc = false;
  s = location.href; // address bar
  q = s.indexOf("?"); // look for "?"
  if ( q >= 0 ) {
    s = s.slice(q+1); // get the arguments

    // look for url in the address bar
    p = s.indexOf("url="); // look for "url="
    if ( p >= 0 ) {
      args = s.slice(0,p);
      url = s.slice(p+4); // everything after "url="
    } else {
      args = s;
    }

    enc = ( args.indexOf("enc") >= 0 && args.indexOf("enc=0") < 0 );
  }

  if ( url === undefined ) {
    document.getElementById("enc-link").checked = enc;
    showGenPanel();
  } else { // open the link
    openURL(url, enc);
  }
})();
