"use strict";

var ShortenUrl = (function(){

function createXMLHttp()
{
  if ( window.XMLHttpRequest ) {
    return new XMLHttpRequest();
  } else { // for IE5 and IE6
    return new ActiveXObject("Microsoft.XMLHTTP");
  }
}

// extract the path from the input `url`,
// check it against the list of valid server path `patterns`,
// if it is one of them, choose it, otherwise, use the `defPath`
// if `https` is given, convert http:// path to https:// ones
function selectServerPath(url, patterns, defPath, https)
{
  var m = /^(http.*\/|localhost:.*\/).*?\.(htm|php)/.exec(url), p, j, path = defPath;
  if ( m !== null ) {
    p = m[1]; // tentative server path, e.g. http://abc.com/dir1/dir2/
    // check against the permissible server patterns
    for ( j = 0; j < patterns.length; j++ ) {
      if ( patterns[j].test(p) ) {
        path = p;
        break;
      }
    }
    // otherwise, p is not one of the valid server paths
  }
  if ( https ) {
    path = path.replace(/^http:\/\//, "https://");
  }
  // append a slash if needed
  if ( path.charAt(path.length-1) !== "/" ) {
    path += "/";
  }
  return path;
}

// AJAX URL shortener
function shortenUrl(url, type, callbackFunc, phpScriptPath)
{
  var xmlhttp = createXMLHttp();
  xmlhttp.onreadystatechange = function() {
    if ( xmlhttp.readyState == 4 // ready
      && xmlhttp.status == 200 ) { // OK
      // the url has been shortened
      var resp = xmlhttp.responseText;
      if ( resp.slice(0, 5).toLowerCase() !== "error" ) {
        var surl = resp; // if no error, response is url
        callbackFunc(resp);
      } else {
        console.log("shortenUrl() failed\nURL: " + url + "\n"
          + "Type: " + type + "\n"
          + "Path: " + phpScriptPath + "\n" + resp);
      }
    }
  };

  if ( phpScriptPath === undefined ) {
    phpScriptPath = selectServerPath(location.href,
      [/bhffer\.com/, /xljt.cloud/, /localhost:/],
      "https://app.bhffer.com/");
  }
  // append a slash if needed
  if ( phpScriptPath.charAt(phpScriptPath.length-1) !== "/" ) {
    phpScriptPath += "/";
  }

  var cmd = phpScriptPath + 'urlshortener.php?', opts = [];
  if ( type !== null && type !== undefined ) {
    opts.push( 'type=' + encodeURIComponent(type) );
  }
  opts.push( 'url=' + encodeURIComponent(url) );
  cmd += opts.join('&');
  xmlhttp.open("GET", cmd, true);
  xmlhttp.send();
}

return {
  shortenUrl: shortenUrl,
};

})();


