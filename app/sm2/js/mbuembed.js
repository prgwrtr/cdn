(function(root){
  // root path for sm2 css and js
  if ( root === undefined ) {
    root = "https://cdn.jsdelivr.net/gh/prgwrtr/cdn@0.1.4/app/sm2/";
    //root = "https://app.bhffer.com/sm2/";
  }

  var getfn = function(url) {
    var i = url.lastIndexOf("/");
    if ( i >= 0 ) return url.slice(i+1);
    else return url;
  },

  findJS = function(url) {
    var x = document.getElementsByTagName("SCRIPT"), i, fn = getfn(url);
    for ( i = 0; i < x.length; i++ ) {
      if ( x[i].src.indexOf(fn) >= 0 ) {
        return x[i];
      }
    }
    return null;
  },

  installJS = function(url) {
    var s = document.createElement("SCRIPT");
    s.src = url;
    document.body.append(s);
  },

  findCSS = function(url) {
    var x = document.getElementsByTagName("LINK"), i, fn = getfn(url);
    for ( i = 0; i < x.length; i++ ) {
      if ( x[i].href.indexOf(fn) >= 0 ) {
        return x[i];
      }
    }
    return null;
  },

  installCSS = function(url) {
    var s = document.createElement("LINK");
    s.rel = "stylesheet";
    s.href = url;
    document.getElementsByTagName("head")[0].append(s);
  },

  installSwitchCSS = function(search, url, urlPatch) {
    var s = findCSS(search);
    //console.log("looking for " + search + ", found " + (s?s.href:"null"));
    if ( s === null ) {
      // system doesn't have the CSS, install the external one
      //console.log("installing external CSS ", url);
      installCSS(url);
    } else if ( s.href.indexOf(search) >= 0 ) {
      // system already has the CSS, install the patch
      //console.log("replacing the CSS", s.href, "by", url);
      //s.href = url;
      //console.log("installing the patch CSS ", urlPatch);
      installCSS(urlPatch);
    } // otherwise, leave the current version as is
  },

  // install necessary js and css
  // root is the directory for the css and js (subject to my modification)
  // barUICSS is the pattern to search to see if there is a preinstalled bar-ui.css
  embed = function() {
    // special patch for XLYS mobile version to disable link redirection
    if ( findJS("template/comiis_app/comiis/js/common_u.js") !== null ) {
      // undo common_u.js, line 1329
      $(document).ready(function() {
        $(document).off('click', 'a');
      });
    }

    var min = "";
    // temporarily disable minimization to ensure the correctness
    // use minimized css and js file for the cdn version
    //if ( root.indexOf("cdn.") >= 0 ) min = ".min";
    installSwitchCSS("Sound/bar-ui.css",
      root + "css/bar-ui" + min + ".css",
      root + "css/bar-ui-patch" + min + ".css");

    // we will not change the following two factory js files
    // they can be updated less frequently
    var SM2 = findJS("soundmanager2.js"),
        BarUI = findJS("bar-ui.js");
    if ( SM2 === null || BarUI === null ) {
      // somehow minimized bar-ui.js breaks the pause/play
      // toggle button, so we don't minimize it
      installJS(root + "js/sm2-bar-ui.js");
      // monitor when the script is ready, at the end of bar-ui.js window.SM2BarPlayer is defined
      var x = document.getElementsByClassName("sm2-main-controls"), i, rid;
      // initially hide the control bar(s)
      for ( i = 0; i < x.length; i++ )
        x[i].style.display = "none";
      rid = setInterval(function() {
        if ( window.SM2BarPlayer !== undefined ) {
          clearInterval(rid);
          //console.log("sm2-bar-ui.js is ready");
          // show the control bar(s)
          for ( i = 0; i < x.length; i++ )
            x[i].style.display = "";
        }
      }, 1000); // check every 1s
    }
  };
  embed();
//}());
// for local testing
}("./sm2/"));
