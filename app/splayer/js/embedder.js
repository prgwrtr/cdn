// load "css/splayer.css" and "js/jplayer.js" if necessary
(function(){
  // this function only needs to run once
  if (window.spEmbedderOnce) return;
  window.spEmbedderOnce = 1;

  // root path for the player code
  var root = "https://cdn.jsdelivr.net/gh/prgwrtr/cdn@latest/app/splayer/";
  if (window.spRoot) {
    root = window.spRoot;
  }

  function appendVersion(url) {
    if (window.spVersion) {
      url += "?v=" + window.spVersion;
    }
    return url;
  }

  function getfn(url) {
    var i = url.lastIndexOf("/");
    return (i >= 0) ? url.slice(i+1) : url;
  }

  function findJS(url) {
    var x = document.getElementsByTagName("SCRIPT"), i, fn = getfn(url);
    for (i = 0; i < x.length; i++) {
      if (x[i].src.indexOf(fn) >= 0) {
        return x[i];
      }
    }
  }

  function installJS(url) {
    var s = document.createElement("SCRIPT");
    url = appendVersion(url);
    s.src = url;
    document.body.append(s);
  }

  function findCSS(url) {
    var x = document.getElementsByTagName("LINK"), i, fn = getfn(url);
    for (i = 0; i < x.length; i++) {
      if (x[i].href.indexOf(fn) >= 0) {
        return x[i];
      }
    }
  }

  function installCSS(url) {
    var s = document.createElement("LINK");
    s.rel = "stylesheet";
    if (url.indexOf("jsdelivr") >= 0) {
      // 2021.12.26 disabling the minification
      // It appears that jsdelivr would mess up the relative path with minified css
      //     
      // minimize CSS for the CDN version
      // url = url.replace(/[.]css$/, ".min.css");
    }
    url = appendVersion(url);
    s.href = url;
    document.getElementsByTagName("head")[0].append(s);
  }

  // install necessary js and css
  embed = function() {
    if (!findCSS("css/splayer.css")) {
      console.log("installing splayer.css");
      installCSS(root+"css/splayer.css");
    }

    if (!findJS("js/splayer.js")) {
      console.log("installing splayer.js");
      installJS(root+"js/splayer.js");
    }
  }

  embed();

})();
