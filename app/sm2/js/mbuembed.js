// dynamic installer for the audio playlist plugin
// this file will load the proper CSS and JavaScript files from the remote server
(function(){
  // this function only needs to run once
  if ( window.mbuEmbedOnce ) return;
  window.mbuEmbedOnce = 1;

  var root, ver = null;

  // root path for sm2 css and js
  if ( window.sm2root !== undefined ) {
    root = window.sm2root;
  } else {
    //root = "https://cdn.jsdelivr.net/gh/prgwrtr/cdn@latest/app/sm2/";
    root = "https://app.bhffer.com/sm2/";
  }

  // version
  if ( window.sm2cdnver !== undefined ) {
    ver = window.sm2cdnver;
  }

  function getFn(url) {
    var i = url.lastIndexOf("/");
    return (i >= 0) ? url.slice(i+1) : url;
  }

  function findJS(url) {
    var fn = getFn(url), x = document.querySelectorAll("script");
    for (var i = 0; i < x.length; i++) {
      if (x[i].src.indexOf(fn) >= 0) return x[i];
    };
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

  var isComiisMobileTheme = (findJS("comiis/js/common_u.js") !== null);
  var isComiisTheme = isComiisMobileTheme || (findCSS("comiis_app/comiis/comiis_flxx/comiis_pcflxx.css") !== null);
  //console.log(isComiisMobileTheme, isComiisTheme);

  if (isComiisTheme) {
    // The comiis theme will wrap every <a> tag in a <p> tag
    // and put another <a> tag without content right before the <p> tag
    // so it results in two <a> tags under a single <li>
    // we will hide the second <a> tag within the <li> and move the content to the first
    setInterval(function(){
      document.querySelectorAll(".sm2-bar-ui .sm2-playlist-wrapper li").forEach(function(item){
        var a1 = item.querySelector("a");
        if (!a1 || !a1.href || a1.parentNode !== item) return;
        var a2 = item.querySelector("p > a");
        if (!a2 || !a2.href || a1.href !== a2.href) return;
        if (a2.innerHTML.trim() !== '') {
          a1.innerHTML = a2.innerHTML;
        }
        a2.parentNode.style.display = "none"; // hide this element
      });
    }, 1000);

    // Disabling default clicking behavior for <a> tags in player items
    setInterval(function(){
      document.querySelectorAll(".sm2-bar-ui .sm2-playlist-wrapper li a").forEach(function(a){
        if (!a.clickingDisabled) {
          a.clickingDisabled = true;
          a.addEventListener("click", function(e){ // disabling clicking
            e.preventDefault();
          });
        }
      });
    }, 1000);
  }

  
  function getPlayers() {
    return document.querySelectorAll(".sm2-bar-ui");
  }

  // install necessary js and css
  function embed() {
    if (findCSS("Sound/bar-ui.css") === null) {
      installCSS(root + "css/bar-ui.css");
    } else {
      // the host environment already has the CSS, install the patch
      if (findCSS("bar-ui-patch.") === null) {
        installCSS(root + "css/bar-ui-patch.css");
      }
    }

    if (findJS("soundmanager2.js") === null || findJS("bar-ui.js") === null) {
      // load the combined JS file (already minified)
      installJS(root + "js/sm2-bar-ui.js");
    }
  }

  // initially, hide all players
  // show them only after soundManager and bar-ui are ready
  getPlayers().forEach(function(p){
    if (p.style.display === "none") return;
    p.style.display = "none";
    d = document.createElement("div");
    d.className = "player-info";
    d.innerHTML = "加载中……";
    d.style.textAlign = "center"; // quick CSS in case the css fails to load
    d.style.color = "#620";
    p.parentNode.insertBefore(d, p);
  });

  // regularly check whether it is okay to show the players
  var showPlayerChecker = setInterval(function() {
    if ( window.soundManager !== undefined
      && !window.soundManager.url ) {
      soundManager.setup({url: root + "swf"});
    }

    // at the end of bar-ui.js, window.sm2BarPlayers is defined,
    // which signals that all players have been populated,
    // which happens only after soundManager is ready
    var players = getPlayers();
    if ((window.sm2BarPlayers !== undefined)
      && window.sm2BarPlayers.length >= players.length) {
      // all players are ready, clear the timer
      clearInterval(showPlayerChecker);
      //console.log("soundManager and sm2Players are ready");
      players.forEach(function(p) {
        // add a download icon for each song 
        if (p.className.split(" ").indexOf("item-download") >= 0) {
          var ls = p.querySelector(".sm2-playlist-wrapper");
          if ( !ls ) return;
          ls.querySelectorAll("li").forEach(function(item){
            var a = item.querySelector("a");
            if (!a || !a.href) return;
            var d = document.createElement("span");
            d.className = "item-downloader";
            d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16"> <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/> <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/> </svg>';
            d.onclick = function() { window.open(a.href, "_blank"); };
            item.appendChild(d);
          });
        }

        // unhide the player
        p.style.display = "block";
        d = p.previousSibling;
        if ( d.className === "player-info") {
          d.style.display = "none";
        }

        // turning the title of the playing track to a marquee
        var pt = p.querySelector(".sm2-playlist-target");
        if (!pt) return;
        var d = pt.querySelector("li");
        if (!d) return;
        if ( d.scrollWidth > pt.offsetWidth
          && d.querySelector("marquee") === undefined ) {
          d.innerHTML = "<marquee>" + d.innerHTML + "</marquee>";
        }
      });

      // open the playlists, emulate clicking the folder button
      sm2BarPlayers.forEach(function(p){ p.actions.menu(true); });
    }
  }, 1000); // check every 1s

  // special patch for comiis mobile theme to disable links
  // since common_u.js is in the header, we can and should do this as soon as possible
  if (isComiisMobileTheme) {
    // undo template/comiis_app/comiis/js/common_u.js, line 1329~1331
    // $(document).on('click', 'a', function(e) { ...
    var docReady = false;
    $(document).ready(function() {
      docReady = true;
      $(document).off('click', 'a');
    });
    // we periodically turn off the handler for <a> clicks
    aClickChecker = setInterval(function() {
      $(document).off('click', 'a');
      if (docReady) clearInterval(aClickChecker);
    }, 1000);
  
    // in this case, the plugin is not installed
    // no CSS or JS exists, we can immediately call embed()
    embed();
  } else {
    // in other cases, we embed() only after the DOM is ready,
    // i.e., when $(document).ready(...);
    // to prevent installing the scripts twice
    // NOTE: in the Discuz! forums, the css and script tags for soundmanager2.js
    // and bar-ui.js are located at the end of <body>
    // so when this code is executed, we are unsure
    // if the DOM tree has been parsed

    // detect when the DOM tree is ready, see
    // https://stackoverflow.com/a/1795167/13612859
    // https://www.sitepoint.com/jquery-document-ready-plain-javascript/
    // https://github.com/ded/domready/blob/v0.3.0/ready.js
    if ( document.readyState === "complete" ||
        (document.readyState !== "loading" && !document.documentElement.doScroll) ) {
      // DOMContentLoaded has already been fired
      embed();
    } else if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", function(){
        embed();
      });
    } else if (document.attachEvent) { // IE
      document.attachEvent("onreadystatechange", function(){
        if ( document.readyState === "complete" ) {
          embed();
        }
      });
    }
  }
})();
