"use strict";

var URLHead = {
  // starts with a protocol https://, http://, ftp://
  hasProtocol: function(url) {
    return /^[a-z]+:\/\//i.test(url);
  },

  // add protocol for standard URL
  addProtocol: function(url) {
    if ( URLHead.hasProtocol(url) ) {
      return url;
    } else if ( url.slice(0, 2) === "//" ) { // e.g., //abc.com
      return "http:" + url;
    } else { // e.g., abc.com
      return "http://" + url;
    }
  },

  // cut the protocol part of the url, add "~" if necessary
  // a low-level version of remove()
  cut0: function(url) {
    url = URLHead.addProtocol(url);
    if ( url.slice(0, 8) === "https://" ) {
      return "~" + url.slice(8);
    } else if ( url.slice(0, 7) === "http://"
             && url.slice(0, 8) !== "http://~" ) {
      return url.slice(7);
    } else {
      return url;
    }
  },

  // restore the protocol part of the url, as removed by cut0() or cut() 
  addBack: function(url) {
    if ( URLHead.hasProtocol(url) ) {
      return url;
    } else if ( url.slice(0, 2) === "//" ) {
      return "http:" + url;
    } else if ( url.charAt(0) === "~" ) {
      return "https://" + url.slice(1);
    } else {
      return "http://" + url;
    }
  },

  // cut the protocol part of the url, add "~" if necessary
  // but if it makes the url unrecoverable, return the original url
  cut: function(url) {
    var s = URLHead.addProtocol(url), // standard form
        t = URLHead.cut0(s), // try to trim
        r = URLHead.addBack(t), // try to recover
        err = 0;
    if ( r !== s ) { // recovered the standard form
      console.log("Error: URLHead failed on url:\n" + url + "\n" + s + " [trim] =>\n" + t + " [detrim] =>\n" + r + " != " + s);
      err = 1;
      t = url;
    } else {
      //console.log("Success: url:\n" + url + "\n" + s + " [trim] =>\n" + t + " [detrim] =>\n" + r + " == " + s);
    }
    return {"url": t, "err": err};
  }
};

