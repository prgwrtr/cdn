// load "css/splayer.css" and "js/jplayer.js" if necessary
(function(){
  // this function only needs to run once
  if (window.spEmbedderOnce) return;
  window.spEmbedderOnce = 1;

  // root path for the player code
  var root = "//app1.bhffres.com/splayer/";
  if (window.spRoot) {
    root = window.spRoot;
  }

  var ver = "0.0.6";
  if (window.spVersion) {
    ver = window.spVersion;
  }

  function getFn(url) {
    var i = url.lastIndexOf("/");
    return (i >= 0) ? url.slice(i+1) : url;
  }

  function findJS(url) {
    var fn = getFn(url);
    document.querySelectorAll("script").forEach(function(x){
      if (x.src.indexOf(fn) >= 0) return x;
    });
    return null;
  }

  function installJS(url) {
    var s = document.createElement("script");
    s.src = url + (ver !== null ? '?v='+ver : '');
    document.body.append(s);
  }

  function findCSS(url) {
    var fn = getFn(url), x = document.querySelectorAll("link");
    for (var i = 0; i < x.length; i++) {
      if (x[i].href.indexOf(fn) >= 0) return x[i];
    };
    return null;
  }

  function installCSS(url) {
    var s = document.createElement("link");
    s.rel = "stylesheet";
    s.href = url + (ver !== null ? '?v='+ver : '');
    document.querySelector("head").append(s);
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
