(function(root){
  // root path for sm2 css and js
  if ( root === undefined ) {
    // Note the version don't need to be changed aggressively
    // unless bar-ui(-patch).css, sm2-bar-ui.js are modified
    // so we simply use the latest version
    // but then don't use minified css or js,
    // otherwise, the jsdelivr caching will mess the version up
    //root = "https://cdn.jsdelivr.net/gh/prgwrtr/cdn@0.1.8/app/sm2/";
    root = "https://cdn.jsdelivr.net/gh/prgwrtr/cdn@latest/app/sm2/";
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
  embed = function() {
    installSwitchCSS("Sound/bar-ui.css",
      root + "css/bar-ui.css",
      root + "css/bar-ui-patch.css");

    var SM2 = findJS("soundmanager2.js"),
        BarUI = findJS("bar-ui.js");
    if ( SM2 === null || BarUI === null ) {
      // load the combined JS file (already minified)
      installJS(root + "js/sm2-bar-ui.js");
      // monitor when the script is ready, at the end of bar-ui.js window.SM2BarPlayer is defined
      var x = document.getElementsByClassName("sm2-bar-ui"), i, rid;
      // initially hide bar-ui, until the script is fully loaded
      for ( i = 0; i < x.length; i++ )
        x[i].style.visibility = "hidden";
      rid = setInterval(function() {
        if ( window.SM2BarPlayer !== undefined ) {
          clearInterval(rid);
          //console.log("sm2-bar-ui.js is ready");
          // show the control bar(s)
          for ( i = 0; i < x.length; i++ )
            x[i].style.visibility = "visible";
        }
      }, 1000); // check every 1s
    }
  };

  // special patch for XLYS mobile version to disable link redirection
  // since common_u.js is in the header, we can and should do this as soon as possible
  if ( findJS("comiis_app/comiis/js/common_u.js") !== null ) {
    // undo common_u.js, line 1329
    $(document).ready(function() {
      $(document).off('click', 'a');
    });
    // in this case, the plugin is not installed, we can also embed() now
    embed();
  } else {
    // in other cases, we embed() only after the DOM is ready,
    // i.e., when $(document).ready(...);
    // because the soundmanager2.js bar-ui.js is positioned after the post html

    // detect when the DOM tree is ready, see
    // https://stackoverflow.com/a/1795167/13612859
    // https://www.sitepoint.com/jquery-document-ready-plain-javascript/
    // https://github.com/ded/domready/blob/v0.3.0/ready.js
    if ( document.readyState === "complete" ||
        (document.readyState !== "loading" && !document.documentElement.doScroll) ) {
      // DOMContentLoaded is already fired
      embed();
    } else if ( document.addEventListener ) {
      document.addEventListener( "DOMContentLoaded", function(){
        // about arguments.callee:
        // https://developer.mozilla.org/en-US/docs/web/javascript/reference/functions/arguments/callee
        document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
        embed();
      }, false );
    } else if ( document.attachEvent ) {
      // ensure firing before onload
      document.attachEvent("onreadystatechange", function(){
        if ( document.readyState === "complete" ) {
          document.detachEvent( "onreadystatechange", arguments.callee );
          embed();
        }
      });
    }
  }
}());
// for local testing
//}("./sm2/"));
