(function() {
  // avoid including this script twice
  if ( window.domainMapScriptRequested__ ) return;
  window.domainMapScriptRequested__ = true;

  var loadData = function(path) {
    var url, min = "", s;
    if ( path === undefined ) {
      path = "https://cdn.jsdelivr.net/gh/prgwrtr/cdn@latest/app/"
    }
    if ( path.indexOf("jsdelivr") >= 0 ) {
      min = ".min";
    }
    url = path + "js/dmapdata" + min + ".js";
    // refresh the browser cache every 5 min = 300 s = 3e5 ms
    url += "?t=" + Math.floor((new Date())/3e5);

    s = document.createElement("SCRIPT");
    s.src = url;
    document.body.append(s);
  };

  // load data now
  loadData(window.domainMapDataPath__);

  // check if the data is ready
  var isReady = function() {
    return ( window.domainMapDataArray__ !== undefined
          && typeof(window.domainMapDataArray__) === "object"
          && window.domainMapDataArray__.length > 0 );
  };

  // substitute dead domain occurrences by a live one
  // if opt.randomPick is true, the live alternative is picked up randomly,
  //    otherwise, the first choice is used
  // if opt.replaceAll is true, multiple occurrences are matched
  // if opt.findAll is true, assume the input contains different
  //    dead domains, and all of them are matched,
  //    otherwise, the function stops at the first match
  var sub = function(url, opt) {
    var data = [];
    if ( isReady() ) {
      data = window.domainMapDataArray__;
    }
    if ( opt === undefined ) opt = {};

    var i, obj, live, j, dead, p0, p, k;
    for ( i = 0; i < data.length; i++ ) {
      obj = data[i];
      for ( j = 0; j < obj.dead.length; j++ ) {
        dead = obj.dead[j];
        // loop over multiple occurrences of `dead`
        for ( p0 = 0; ; ) {
          p = url.indexOf(dead, p0);
          if ( p < 0 ) break;
          // choose a live alternative
          if ( opt.randomPick ) {
            k = Math.floor(Math.random() * obj.live.length);
            live = obj.live[k];
          } else {
            live = obj.live[0];
          }
          url = url.slice(0, p) + live + url.slice(p + dead.length);
          if ( !opt.findAll ) return url;
          if ( !opt.replaceAll ) break;
          // update the index
          p0 += p + live.length;
        }
      }
    }
    return url;
  };

  window.DomainMap = {
    "isReady": isReady,
    "sub": sub
  };
})();

