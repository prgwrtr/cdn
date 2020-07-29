MBUEmbed = {
  // default root for css and js
  // NOTE: the JavaScript relative path, e.g., "./sm2/", is relative
  // to the display page, not to this JS file
  // So, do not use relative path for the CDN
  root: "https://cdn.jsdelivr.net/gh/prgwrtr/cdn@0.0.1/sm2/",
  //root: "https://app.bhffer.com/sm2/",

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

  embed: function(root, defBarUICSS) {
    if ( root === undefined ) root = MBUEmbed.root;
    if ( defBarUICSS === undefined ) defBarUICSS = "Sound/bar-ui.css";
    var min = "";
    // use minimized css and js file for the cdn version
    if ( root.indexOf("cdn.") >= 0 ) min = ".min";
    MBUEmbed.installSwitchCSS(defBarUICSS,
      root + "css/bar-ui" + min + ".css",
      root + "css/bar-ui-patch" + min + ".css");
    MBUEmbed.installScript(root + "js/soundmanager2" + min + ".js");
    MBUEmbed.installScript(root + "js/bar-ui" + min + ".js");
  },
};
MBUEmbed.embed();
//MBUEmbed.embed("./sm2/");
