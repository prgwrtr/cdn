(function(){
  console.log("calling embedder", window.spEmbedderOnce);

  // this function only needs to run once
  if (window.spEmbedderOnce) return;
  window.spEmbedderOnce = 1;

  var root, ver = null;

  // root path for sm2 css and js
  if ( window.spRoot !== undefined ) {
    root = window.spRoot;
  } else {
    root = "https://cdn.jsdelivr.net/gh/prgwrtr/cdn@latest/app/splayer/";
    //root = "https://app.bhffer.com/sm2/";
  }

  // version
  if ( window.spVersion !== undefined ) {
    ver = window.spVersion;
  }

  function getfn(url) {
    var i = url.lastIndexOf("/");
    return (i >= 0) ? url.slice(i+1) : url;
  };

  function findJS(url) {
    var x = document.getElementsByTagName("SCRIPT"), i, fn = getfn(url);
    for (i = 0; i < x.length; i++) {
      if (x[i].src.indexOf(fn) >= 0) {
        return x[i];
      }
    }
    return null;
  };

  function installJS(url) {
    var s = document.createElement("SCRIPT");
    if (ver !== null) {
      // attach the version number to avoid browser cache
      // this number will expire once the CDN version updates
      url += "?v=" + ver;
    }
    s.src = url;
    document.body.append(s);
  };

  function findCSS(url) {
    var x = document.getElementsByTagName("LINK"), i, fn = getfn(url);
    for (i = 0; i < x.length; i++) {
      if (x[i].href.indexOf(fn) >= 0) {
        return x[i];
      }
    }
    return null;
  };

  function installCSS(url) {
    var s = document.createElement("LINK");
    s.rel = "stylesheet";
    if (url.indexOf("jsdelivr") >= 0) {
      // minimize CSS for the CDN version
      url = url.replace(/[.]css$/, ".min.css");
    }
    if (ver !== null) {
      // attach the version number to avoid browser cache
      // this number will expire once the CDN version updates
      url += "?v=" + ver;
    }
    s.href = url;
    document.getElementsByTagName("head")[0].append(s);
  };

  function getSinglePlayers() {
    return document.getElementsByClassName("sp-single");
  };

  // install necessary js and css
  embed = function() {
    var css = findCSS("css/splayer.css");
    console.log(css);
    if (css === null) {
      console.log("installing splayer.css");
      installCSS(root + "css/splayer.css");
    }

    var js = findJS("js/splayer.js");
    if (js === null) {
      console.log("installing splayer.js");
      installJS(root + "js/splayer.js");
    }
    console.log("embed called");
  };

  embed();
})();
