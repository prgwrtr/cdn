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

function genLink()
{
  var s = location.href, outurl = s; // address bar
  var q = s.indexOf("?"); // look for "?"
  if ( q >= 0 ) outurl = s.slice(0, q);

  // remove "http://" and "https://" from the input url
  var url = document.getElementById("inp-url").value;
  url = url.split("\n")[0].trim(); // get the first line
  var ret = URLHead.cut(url);
  if ( ret.err || ret.url === "" ) {
    document.getElementById("out-url-wrapper").style.display = "none";
    var a = document.getElementById("out-url");
    a.innerHTML = "";
    a.href = "#";
    return;
  }
  url = ret.url;

  var args = [];

  var mode = document.getElementById("mode").value;
  if ( mode !== "0" ) {
    args.push("mode=" + mode);
  }
  // if inline display (like frame.html) is need,
  // change https to http to avoid the mix content error
  if ( mode === "2" || mode === "3" ) {
    outurl = outurl.replace(/^https:\/\//g, "http://");
  }

  var enc = document.getElementById("enc").value;
  if ( enc !== "0" ) { // "0" is the encoding
    args.push("enc=" + enc);
  }
  if ( enc === "1" ) {
    url = flipenc(url);
  } else if ( enc === "2" ) {
    url = URIB64.encode(url, "~");
  }
  if ( enc !== "none" ) {
    url = encodeURIComponent(url);
  }
  args.push("url=" + url);

  // form the final link
  outurl += "?" + args.join("&");

  document.getElementById("out-url-wrapper").style.display = "";
  var a = document.getElementById("out-url");
  a.innerHTML = outurl;
  a.href = outurl;
}

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

function copyLink(cpbtn) {
  var s = document.getElementById("out-url").href;
  copyTextToClipboard(s, cpbtn);
  animateShow("out-url", [1.0, 1000, 1.0, 700, 0.4, 500, 0.4, 800, 1.0]);
}

function handleInputURL(url, mode, enc)
{
  // decode the url
  if ( enc !== "none" ) {
    url = decodeURIComponent(url);
    if ( enc === "1" ) {
      url = flipenc(url);
    } else if ( enc === "2" ) {
      url = URIB64.decode(url);
    }
  }
  // prepend "http://" or "https://" if necessary
  url = URLHead.addBack(url);
  document.getElementById("url").innerHTML = url;

  // check if the browser is Wechat
  var isWechat = !!navigator.userAgent.match(/MicroMessenger/i), action;

  if ( mode === "0" ) { // prompt for redirection if in wechat
    if ( isWechat ) action = "prompt-redir";
    else action = "go";
  } else if ( mode === "1" ) { // always prompt for redirection
    action = "prompt-redir";
  } else if ( mode === "2" ) { // embed webpage if in wechat
    if ( isWechat ) action = "embed";
    else action = "go";
  } else if ( mode === "3" ) {
    action = "embed";
  } else if ( mode === "go" ) {
    action = "go";
  }

  if ( action === "go" ) {
    location.href = url;
  } else if ( action === "prompt-redir" ) {
    document.getElementById("redir-panel").style.display = "";
  } else if ( action === "embed" ) {
    document.getElementById("container").style.display = "none";
    document.getElementsByTagName("TITLE")[0].innerHTML = ".";
    var ifr = document.getElementById("embed-page");
    ifr.src = url;
    ifr.style.display = "";
  }
}

(function(){
  // main function
  var s, p, q, args, url = undefined, mode = "0", enc = "0", i, kv;
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

    args = args.split("&");
    for ( i = 0; i < args.length; i++ ) {
      kv = args[i].split("=");
      if ( kv[0] === "mode" ) {
        if ( kv[1] !== undefined && kv[1] !== "" ) {
          mode = kv[1];
        } else {
          mode = "0";
        }
        document.getElementById("mode").value = mode;
      }
      if ( kv[0] === "enc" ) {
        if ( kv[1] !== undefined && kv[1] !== "" ) {
          enc = kv[1];
        } else {
          enc = "1";
        }
        document.getElementById("enc").value = enc;
      }
    }
  }

  if ( url === undefined ) {
    // no url in address bar, show the generation panel
    document.getElementById("gen-panel").style.display = "";
  } else { // open the link
    handleInputURL(url, mode, enc);
  }
})();
