MBUEmbed = {
  // default root for css and js
  // NOTE: the JavaScript relative path, e.g., "./sm2/", is relative
  // to the display page, not to this JS file
  // So, do not use relative path for the CDN
  //root: "https://cdn.jsdelivr.net/gh/prgwrtr/cdn@0.0.9/app/sm2/",
  root: "https://app.bhffer.com/sm2/",
  safeRoot: "https://app.bhffer.com/sm2/",
  //safeRoot: "https://cdn.jsdelivr.net/gh/prgwrtr/cdn@0.0.9/app/sm2/",

  getfn: function(url) {
    var i = url.lastIndexOf("/");
    if ( i >= 0 ) return url.slice(i+1);
    else return url;
  },

  findJS: function(url) {
    var x = document.getElementsByTagName("SCRIPT"), i, fn = MBUEmbed.getfn(url);
    for ( i = 0; i < x.length; i++ ) {
      if ( x[i].src.indexOf(fn) >= 0 ) {
        return x[i];
      }
    }
    return null;
  },

  installJS: function(url) {
    var s = document.createElement("SCRIPT");
    s.src = url;
    document.body.append(s);
  },

  // install a script whose src=url
  installScript: function(url) {
    var s = MBUEmbed.findJS(url);
    //console.log("looking for " + url + ", found " + (s?s.src:"null"));
    if ( s === null ) {
      MBUEmbed.installJS(url);
    }
  },

  findCSS: function(url) {
    var x = document.getElementsByTagName("LINK"), i, fn = MBUEmbed.getfn(url);
    for ( i = 0; i < x.length; i++ ) {
      if ( x[i].href.indexOf(fn) >= 0 ) {
        return x[i];
      }
    }
    return null;
  },

  installCSS: function(url) {
    var s = document.createElement("LINK");
    s.rel = "stylesheet";
    s.href = url;
    document.getElementsByTagName("head")[0].append(s);
  },

  installCSS2: function(url) {
    var s = '<link rel="stylesheet" href="' + url + '">';
    document.body.insertAdjacentHTML('beforeend', s);
  },

  installSwitchCSS: function(search, url, urlPatch) {
    var s = MBUEmbed.findCSS(search);
    //console.log("looking for " + search + ", found " + (s?s.href:"null"));
    if ( s === null ) {
      // system doesn't have the CSS, install the external one
      //console.log("installing external CSS ", url);
      MBUEmbed.installCSS2(url);
    } else if ( s.href.indexOf(search) >= 0 ) {
      // system already has the CSS, install the patch
      //console.log("replacing the CSS", s.href, "by", url);
      //s.href = url;
      //console.log("installing the patch CSS ", urlPatch);
      MBUEmbed.installCSS(urlPatch);
    } // otherwise, leave the current version as is
  },

  // patch XLYS mobile version
  patchXLYSMobile: function() {
    if ( null === MBUEmbed.findJS("template/comiis_app/comiis/js/common_u.js?kY8") ) {
      return;
    }
    // cancel common_u.js, line 1329
    $(document).ready(function() {
      $(document).off('click', 'a');
    });
  },

  // install necessary js and css
  // root is the directory for the css and js (subject to my modification)
  // safeRoot is the directory for factory css and js
  // defBarUICSS is the pattern to search to see if there is a preinstalled bar-ui.css
  embed: function(root, safeRoot, defBarUICSS) {
    if ( root === undefined ) root = MBUEmbed.root;
    if ( safeRoot === undefined ) safeRoot = MBUEmbed.safeRoot;
    if ( defBarUICSS === undefined ) defBarUICSS = "Sound/bar-ui.css";
    MBUEmbed.installSwitchCSS(defBarUICSS,
      root + "css/bar-ui.css",
      root + "css/bar-ui-patch.css");

    // special patch for XLYS mobile version
    MBUEmbed.patchXLYSMobile();

    // we will not change the following two factory js files
    // they can be updated less frequently
    MBUEmbed.installScript(safeRoot + "js/soundmanager2.js");
    // somehow minimized bar-ui.js breaks the pause/play toggle button
    MBUEmbed.installScript(safeRoot + "js/bar-ui.js");
  },
};
MBUEmbed.embed();
// for local testing
//MBUEmbed.embed("./sm2/", "./sm2/");
