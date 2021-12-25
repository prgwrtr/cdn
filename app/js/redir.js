"use strict";

function isWeixin()
{
  return !!navigator.userAgent.match(/MicroMessenger/i);
}

// encode a string by 1. flipping and 2. randomly swapping some letters
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
  var server = document.getElementById("server").value,
      outurl = server;

  if ( server === "" ) { // use the current page as redir server
    var s = location.href;
    outurl = s; // address bar
    var q = s.indexOf("?"); // look for "?"
    if ( q >= 0 ) outurl = s.slice(0, q);
  }

  // remove "http://" and "https://" from the input url
  var url = document.getElementById("inp-url").value;
  url = url.split("\n")[0].trim(); // get the first line

  // remove the leading "http://" or "https://"
  var ret = URLHead.cut(url);
  if ( ret.err ) {
    url = "";
  } else {
    url = ret.url;
  }

  // removing the trailing "/"
  if ( url.length > 0 ) {
    var c = url.charAt(url.length - 1);
    if ( c === "/" ) {
      url = url.slice(0, url.length - 1);
    }
  }

  if ( url === "" ) {
    // hide the output wrapper if url is empty
    document.getElementById("out-url-group").style.display = "none";
    var a = document.getElementById("out-url");
    a.innerHTML = "";
    a.href = "#";
    return;
  }

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
  if ( enc !== "0" ) { // "0" is the default encoding
    args.push("enc=" + enc);
  }

  var mobile = document.getElementById("mobile").value;
  if ( mobile !== "" ) { // "" means auto
    args.push("mobile=" + mobile);
  }

  var dmap = document.getElementById("dmap").value;
  if ( dmap !== "1" ) { // domain map is enabled by default
    args.push("dmap=" + dmap);
  }

  var title = document.getElementById("inp-title").value;
  if ( title.trim() !== "" ) {
    // for Chinese titles, URIB64 can hide the content while being coding efficient
    title = URIB64.encode(title, "~");
    args.push("title=" + title);
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

  document.getElementById("out-url-group").style.display = "";
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
  // shortenURL() is defined in shortenurl.js
  shortenURL(s, 'bit.ly', linkShortened);
}

function copyLink(cpbtn) {
  var el = document.getElementById("out-url"), s = el.href;
  copyTextToClipboard(s, cpbtn);
  animateShow(el, [1.0, 1000, 1.0, 700, 0.4, 500, 0.4, 800, 1.0]);
}

function copyURL(cpbtn) {
  var el = document.getElementById("url"), s = el.dataUrl;
  copyTextToClipboard(s, cpbtn);
  animateShow(el, [1.0, 300, 0.5, 200, 0.5, 500, 1.0]);
}

function setMobileViewport() {
  var x = document.getElementById("viewport");
  x.name = "viewport";
  x.content = "width=device-width,initial-scale=1";
}

function handleInputURL(url, mode, enc, title, mobile, dmap, wxRedirect)
{
  var x, i;

  // so we need to avoid that
  // decode the url
  if ( enc !== "none" ) {
    // 2020.8.28: remove additional parameters after url=
    // e.g. Weixin would appends "&from=timeline" when shared on Momemts
    // we can safely remove these parameters if any encoding scheme exists
    if ( (i=url.indexOf("&")) >= 0 ) {
      url = url.slice(0, i);
    }
    url = decodeURIComponent(url);
    if ( enc === "1" ) {
      url = flipenc(url);
    } else if ( enc === "2" ) {
      url = URIB64.decode(url);
    }
  } else {
    if ((i=url.indexOf("&from=")) >= 0 ) {
      url = url.slice(0, i);
    }
  }
  // prepend "http://" or "https://" if necessary
  url = URLHead.addBack(url);

  // replace dead domain names
  if ( window.DomainMap !== undefined && dmap !== "0" ) {
    var url1 = DomainMap.sub(url,
      {"randomPick": false, "findAll": false, "replaceAll": false});
    if ( url1 !== url ) {
      //alert("DomainMap: " + url + " => " + url1);
      //console.log("DomainMap: " + url + " => " + url1);
      url = url1;
    }
  }
  document.getElementById("url").innerHTML = url;
  document.getElementById("url").dataUrl = url;

  // handle wx_redirect commands
  console.log("url", url, "wx_redirect", wxRedirect);
  if (wxRedirect == "1") {
    var wxUrl = "https://support.weixin.qq.com/cgi-bin/mmsupport-bin/readtemplate?t=w_redirect_taobao&url=" + encodeURIComponent(url);
    location.replace(wxUrl);
    return;
  }

  var action;

  if ( mode === "0" ) { // prompt for redirection if in wechat
    if ( isWeixin() ) action = "prompt-redir";
    else action = "go";
  } else if ( mode === "1" ) { // always prompt for redirection
    action = "prompt-redir";
  } else if ( mode === "2" ) { // embed webpage if in wechat
    if ( isWeixin() ) action = "embed";
    else action = "go";
  } else if ( mode === "3" ) {
    action = "embed";
  } else if ( mode === "go" ) {
    action = "go";
  }

  if ( action === "go" ) {
    location.href = url;
  } else if ( action === "prompt-redir" ) {
    setMobileViewport();
    document.getElementById("redir-panel").style.display = "";
  } else if ( action === "embed" ) {
    if ( mobile === "1"
      || (mobile === "" && isMobileDevice()) ) {
      setMobileViewport();
    }
    document.getElementById("container").style.display = "none";
    var ifr = document.getElementById("embed-page");
    ifr.src = url;
    ifr.style.display = "";
  }

  if ( action !== "go" ) {
    // reset the page title
    x = document.getElementsByTagName("TITLE")[0];
    if ( x ) {
      x.innerHTML = ( title !== "" ?  title : "." );
    }
  }
}


// wait till the DomainMap data is loaded and then display data
function handleInputURLWait(url, mode, enc, title, mobile, dmap, wxRedirect)
{
  if ( dmap === "0" || window.DomainMap.isReady() ) {
    handleInputURL(url, mode, enc, title, mobile, dmap, wxRedirect);
  } else {
    var timer = setInterval(function() {
      if ( window.DomainMap.isReady() ) {
        handleInputURL(url, mode, enc, title, mobile, dmap, wxRedirect);
        clearInterval(timer);
      }
    }, 200);
  }
}


(function(){
  // main function
  var s, p, q, args,
      url = undefined, mode = "0", enc = "0", mobile = "",
      dmap = "1", title = "", wxRedirect = "", i, kv;

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

      } else if ( kv[0] === "enc" ) {
        if ( kv[1] !== undefined && kv[1] !== "" ) {
          enc = kv[1];
        } else {
          enc = "1"; // this is the default when parameter "enc" exists
        }
        document.getElementById("enc").value = enc;

      } if ( kv[0] === "title" ) {
        if ( kv[1] !== undefined && kv[1] !== "" ) {
          title = URIB64.decode(kv[1]);
        } else {
          title = "";
        }
        document.getElementById("title").innerHTML = title;

      } else if ( kv[0] === "mobile" ) {
        if ( kv[1] !== undefined && kv[1] !== "" ) {
          mobile = kv[1];
        } else {
          mobile = "1"; // this is the default when parameter "mobile" exists
        }
        document.getElementById("mobile").value = mobile;

      } else if ( kv[0] === "dmap" ) {
        if ( kv[1] !== undefined && kv[1] !== "" ) {
          dmap = kv[1];
        } else {
          dmap = "1"; // this is the default when parameter "dmap" exists
        }
        document.getElementById("dmap").value = dmap;

      } else if ( kv[0] === "wx_redirect" ) {
        if ( kv[1] !== undefined && kv[1] !== "" ) {
          wxRedirect = kv[1];
        } else {
          wxRedirect = "";
        }

      } else if ( kv[0] === "advanced" ) {
        if ( kv[1] !== "0" ) {
          document.getElementById("advanced-options").style.display = "";
        }
      }
    }
  }

  if ( url === undefined ) {
    // no url in address bar, show the generator panel
    setMobileViewport();
    document.getElementById("gen-panel").style.display = "";
  } else { // open the link
    handleInputURLWait(url, mode, enc, title, mobile, dmap, wxRedirect);
  }
})();
