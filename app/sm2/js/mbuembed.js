// install the proper css and js file
(function(){
  // this function only needs to be run once
  if ( window.mbuEmbedOnce ) return;
  window.mbuEmbedOnce = 1;

  var root, ver = null;

  // root path for sm2 css and js
  if ( window.sm2root !== undefined ) {
    root = window.sm2root;
  } else {
    root = "https://cdn.jsdelivr.net/gh/prgwrtr/cdn@latest/app/sm2/";
    //root = "https://app.bhffer.com/sm2/";
  }

  // version
  if ( window.sm2cdnver !== undefined ) {
    ver = window.sm2cdnver;
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
    if ( ver !== null ) {
      // attach the version number to avoid browser cache
      // this number will expire once the CDN version updates
      url += "?v=" + ver;
    }
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
    if ( ver !== null ) {
      // attach the version number to avoid browser cache
      // this number will expire once the CDN version updates
      url += "?v=" + ver;
    }
    s.href = url;
    document.getElementsByTagName("head")[0].append(s);
  },

  getPlayers = function() {
    return document.getElementsByClassName("sm2-bar-ui");
  },

  // install necessary js and css
  embed = function() {
    var barUICSS = findCSS("Sound/bar-ui.css");
    //console.log("looking for bar-ui.css, found " + (s?s.href:"null"));
    if ( barUICSS === null ) {
      // system doesn't have the CSS, install the external one
      //console.log("installing external CSS ", url);
      installCSS(root + "css/bar-ui.css");
    } else {
      // system already has the CSS, install the patch
      installCSS(root + "css/bar-ui-patch.css");
    }

    var sm2JS = findJS("soundmanager2.js"),
        barUIJS = findJS("bar-ui.js");
    if ( sm2JS === null || barUIJS === null ) {
      // load the combined JS file (already minified)
      installJS(root + "js/sm2-bar-ui.js");
    }
  };

  // initially, hide all players
  // show them only after soundManager and bar-ui are ready
  (function() {
    var players = getPlayers(), i, p, d;
    for ( i = 0; i < players.length; i++ ) {
      p = players[i];
      p.style.display = "none";
      d = document.createElement("DIV");
      d.className = "player-info";
      d.innerHTML = "加载中……";
      d.style.textAlign = "center";
      d.style.color = "#620";
      p.parentNode.insertBefore(d, p);
    }
  })();

  // regularly check whether it is okay to show the players
  var showPlayerChecker = setInterval(function() {
    if ( window.soundManager !== undefined
      && !window.soundManager.url ) {
      soundManager.setup({url: root + "swf"});
    }
    // at the end of bar-ui.js, window.sm2BarPlayers is defined
    // that signals that all players have been populated,
    // which happens only after soundManager is ready
    var players = getPlayers();
    if ( window.sm2BarPlayers !== undefined
      && window.sm2BarPlayers.length >= players.length ) {
      // all players are ready, clear the timer
      clearInterval(showPlayerChecker);
      //console.log("soundManager and sm2Players are ready");
      var players = getPlayers(), i, p, d;
      for ( i = 0; i < players.length; i++ ) {
        p = players[i];
        p.style.display = "";
        d = p.previousSibling;
        if ( d.className === "player-info") {
          d.style.display = "none";
        }
      }
      // open the playlists, emulate clicking the menu
      for ( i = 0; i < sm2BarPlayers.length; i++ ) {
        sm2BarPlayers[i].actions.menu(true);
      }
      // start the marquee
      for ( i = 0; i < players.length; i++ ) {
        p = players[i].getElementsByClassName("sm2-playlist-target")[0];
        if ( !p ) continue;
        d = p.getElementsByTagName("LI")[0];
        if ( !d ) continue;
        if ( d.scrollWidth > p.offsetWidth
          && d.getElementsByTagName("MARQUEE")[0] === undefined ) {
          //console.log("adding <marquee>", p.scrollWidth, p.offsetWidth);
          d.innerHTML = "<marquee>" + d.innerHTML + "</marquee>";
        }
      }
    }
  }, 1000); // check every 1s

  // special patch for XLYS/ZYXL mobile version to disable link redirection
  // since common_u.js is in the header, we can and should do this as soon as possible
  if ( findJS("comiis/js/common_u.js") !== null ) {
    // undo common_u.js, line 1329
    docReady = false;
    $(document).ready(function() {
      docReady = true;
      $(document).off('click', 'a');
    });
    // we periodically turn off the handler for <a> clicks
    aClickChecker = setInterval(function() {
      $(document).off('click', 'a');
      if ( docReady ) clearInterval(aClickChecker);
    }, 1000);
    // in this case, the plugin is not installed
    // no CSS and JS exists
    // we can immediately embed()
    embed();
  } else {
    // in other cases, we embed() only after the DOM is ready,
    // i.e., when $(document).ready(...);
    // otherwise we may install the scripts twice
    // NOTE: in the forums, the css and script tags for soundmanager2.js
    // and bar-ui.js are located at the end of <body>
    // so when this code is executed, we are unsure
    // if the DOM tree has been parsed

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
})();
