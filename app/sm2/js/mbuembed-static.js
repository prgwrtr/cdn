// static initializer
// this file is to be placed after the usual soundmanager.js and bar-ui.js
(function(){


  var initItemDownload = function(player) {
    var itemDownload = ( player.className.split(" ").indexOf("item-download") >= 0 );
    if ( itemDownload ) {
      var ls = player.getElementsByClassName("sm2-playlist-wrapper")[0];
      if ( !ls ) return;
      var items = ls.getElementsByTagName("LI"), i;
      for ( i = 0; i < items.length; i++ ) {
        var a = items[i].getElementsByTagName("A")[0];
        if ( !a || !a.href ) continue;

        // add a download link for this item
        var d = document.createElement("SPAN");
        d.className = "item-downloader";
        //d.innerHTML = '下载';
        d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16"> <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/> <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/> </svg>';
        d.onclick = (function(href){
          return function() {
            //var a2 = document.createElement("A"); a2.href = href; a2.download = "audio.mp3"; a2.click();
            window.open(href, "_blank");
          };
        })(a.href);
        items[i].appendChild(d);
      }
    }
  };

  var players = document.getElementsByClassName("sm2-bar-ui"), i, p, d;
  for ( i = 0; i < players.length; i++ ) {
    p = players[i];
    // add a download link for each item
    initItemDownload(p);
    // unhide the player
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
    // convert the title of the playing track to a marquee
    if ( d.scrollWidth > p.offsetWidth
      && d.getElementsByTagName("MARQUEE")[0] === undefined ) {
      //console.log("adding <marquee>", p.scrollWidth, p.offsetWidth);
      d.innerHTML = "<marquee>" + d.innerHTML + "</marquee>";
    }
  }

})();
