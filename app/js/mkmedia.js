"use strict";

var showLinkGenerator = false;

function isDemoMode() {
  return (document.getElementById("demo-page").style.display !== "none");
}


var URIEncodingError = 0;

function URIEncode(s, enc, isURL)
{
  if ( enc == "3" && typeof(URLAlias) !== 'undefined' && typeof(URIB64) !== 'undefined' ) {
    var ret = URLAlias.toAliasX(s);
    if ( ret.err == 0 ) {
      s = ret.s;
    } else {
      URIEncodingError = "3";
      console.log("Error: URLAlias.toAlias() fail to encode the input:\n" + s);
    }
    s = URIB64.encode(s, "~"); // add "~" to whitelist
  } else if ( enc == "2" && typeof(URIB64) !== 'undefined') {
    if ( isURL ) s = stripHTTP(s);
    s = URIB64.encode(s, "~"); // add "~" to whitelist
  } else {
    if ( isURL ) s = stripHTTP(s);
    s = encodeURIComponent(s);
  }
  return s;
}

function URIDecode(s, enc, isURL)
{
  if ( enc == "3" && typeof(URLAlias) !== 'undefined' && typeof(URIB64) !== 'undefined' ) {
    s = URIB64.decode(s);
    s = URLAlias.fromAlias(s);
  } else if ( enc == "2" && typeof(URIB64) !== 'undefined') {
    s = URIB64.decode(s);
    if ( isURL ) s = restoreURL(s);
  } else {
    s = decodeURIComponent(s);
    if ( isURL ) s = restoreURL(s);
  }
  return s;
}

// search the pattern of `?key=val` or `&key=val` in the string, and return the `val`
String.prototype.queryString = function(key) {
  var reg = new RegExp("[\?\&]" + key + "=([^\&]+)", "i");
  var r = this.match(reg);
  return ( r !== null ) ? unescape(r[1]) : null;
};

function getInput() {
  var s, p, ret = {};
  // for display the default encoding is "0"
  // (when the "enc" parameter is not specified).
  // This is for backward compatibility.
  var enc = "0";
  s = location.href; // address bar
  p = s.indexOf("?");
  if ( p < 0 ) return ret;
  s = s.slice(p+1);
  var x = s.split("&"), i;
  for ( i = 0; i < x.length; i++ ) {
    var q = x[i].indexOf("="), key, val;
    if ( q >= 0 ) {
      key = x[i].slice(0, q);
      var isURL = ( key === "src" || key === "poster" );
      val = URIDecode(x[i].slice(q+1), enc, isURL);
      if ( key === "enc" ) {
        enc = val;
      }
    } else {
      key = x[i];
      val = "";
    }
    ret[key] = val;
  }
  return ret;
}

function escapeHTML(s) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  // equivalent to PHP htmlspecicalchars()
  s = s.replace(/[&<>"'\n]/g, function(m) { return map[m]; });
  s = s.replace(/\n/g, "<br/>");
  return s;
}

function modifyPageTitle(info)
{
  var title = info["title"];
  if ( title === undefined ) return;
  title = escapeHTML(title);
  var x = document.getElementsByTagName("TITLE"), i;
  for ( i = 0; i < x.length; i++ ) {
    x[i].innerHTML = title;
  }
}

function renderTemplateFunc(s)
{
  if ( isDemoMode() ) {
    document.getElementById("demo-canvas").innerHTML = s;
  } else { // preview mode
    document.getElementById("preview-canvas").innerHTML = s;
    document.getElementById("code").value = s;
  }
}

function renderBackground(info)
{
  var bgs = MediaCom.getBackgroundStyle(info);
  if ( !bgs ) {
    return;
  }
  if ( isDemoMode() ) {
    document.getElementsByTagName("BODY")[0].style.background = "transparent";
    var el = document.getElementById("demo-page");
    el.style = bgs;
  } else {
    if ( showLinkGenerator ) {
      // apply the background only for link generation
      // because the code doesn't contain the background part
      var el = document.getElementById("preview-wrapper");
      el.style = bgs;
    }
  }
}

function showError()
{
  var s = window.location.href; // 地址栏
  var p = s.indexOf("?");
  var msg = "";
  if ( p >= 0 ) {
    s = s.slice(p+1);
    msg = "无法显示以下代码：<br>" + s;
  }
  if ( isDemoMode() ) {
    document.getElementById("demo-canvas").innerHTML = msg;
  } else {
    document.getElementById("preview-canvas").innerHTML = msg;
  }
}

// this function is called either as a demo or a preview
function render(info) {
  if ( info === undefined ) {
    info = getInput();
  }
  if ( isDemoMode() ) {
    modifyPageTitle(info);
  }
  // change the page background according to style
  renderBackground(info);

  MediaCom.render(info, renderTemplateFunc, showError);
}

function onChangeMediaType()
{
  var obj = document.getElementById("inp-media-type");
  var mtype = obj.value;

  // adjust the title
  var objTitle = document.getElementById("inp-media-title");
  var objSrc = document.getElementById("inp-media-src");
  if ( mtype === "video" ) {
    objTitle.value = objTitle.value.replace(/〔(视频|音频|图片)〕/g, "〔视频〕");
    objSrc.setAttribute("placeholder", "http://my.web.site/video.mp4");
  } else if ( mtype === "audio" ) {
    objTitle.value = objTitle.value.replace(/〔(视频|音频|图片)〕/g, "〔音频〕");
    objSrc.setAttribute("placeholder", "http://my.web.site/audio.mp3");
  } else if ( mtype === "image" ) {
    objTitle.value = objTitle.value.replace(/〔(视频|音频|图片)〕/g, "〔图片〕");
    objSrc.setAttribute("placeholder", "http://my.web.site/image.jpg");
  }

  if ( mtype === "video" ) {
    showOrHide("#inp-video-poster-wrapper", true);
    showOrHide("#inp-video-options", true);
  } else {
    showOrHide("#inp-video-poster-wrapper", false);
    showOrHide("#inp-video-options", false);
  }

  if ( mtype === "audio" ) {
    showOrHide("#inp-audio-options", true);
  } else {
    showOrHide("#inp-audio-options", false);
  }
}

function stripHTTP(s)
{
  if ( s.slice(0, 7) === "http://" ) {
    return s.slice(7);
  } else if ( s.slice(0, 8) === "https://" ) {
    return "~" + s.slice(8);
  }
  return s;
}

// prepend http:// or https:// to the url
function restoreURL(s, enc)
{
  if ( s.slice(0, 4) === "http"
    || s.slice(0, 3) === "ftp"
    || s.slice(0, 2) === "//" ) {
    return s;
  }
  if ( s.charAt(0) === "~" ) {
    s = "https://" + s.slice(1);
  } else {
    s = "http://" + s;
  }
/*
  // append a random seed to the url
  var p = s.indexOf("?"), rnd = Math.floor(Math.random()*10000);
  if ( p >= 0 ) {
    s += "&rnd=" + rnd;
  } else {
    s += "?rnd=" + rnd;
  }
*/
  return s;
}

function getQR(s, size)
{
  if ( !size ) size = "200x200";
  var cmd = "http://api.qrserver.com/v1/create-qr-code/?"
  cmd += "size=" + size;
  cmd += "&data=" + encodeURIComponent(s);
  return cmd;
}

function showLongURL(s)
{
  document.getElementById('out-lurl').innerHTML
    = '<a href="{url}" target="_blank" rel="noreferrer noopener">{url}</a>'
      .replace(/{url}/g, s);
  document.getElementById('out-lurl-text').value = s;
}

function makeLongURLQR()
{
  var url = document.getElementById("long-url").value;
  var el = document.getElementById("lurl-qr");
  el.src = getQR(url, "320x320");
  //el.style.display = "";
  animateShow(el, [0.0, 1000, 1.0]);
}

function showShortURL(surl)
{
  document.getElementById("short-url").value = surl;
  var title = document.getElementById("inp-media-title").value;
  document.getElementById('out-surl').innerHTML
    = title + '<br>\n'
    + '<a href="{url}" target="_blank" rel="noreferrer noopener">{url}</a>'
      .replace(/{url}/g, surl);
  document.getElementById('out-surl-text').value = title + '\n' + surl;
  document.getElementById('out-surl-wrapper').style.display = "";
}

function makeShortURLQR()
{
  var url = document.getElementById("short-url").value;
  var el = document.getElementById("surl-qr");
  el.src = getQR(url, "200x200");
  animateShow(el, [0.0, 1000, 1.0]);
}

function copyAnimated(txtSel, btnSel, msgSel, htmlSel)
{
  var txt = document.querySelector(txtSel);
  copyTextToClipboard(txt.value, btnSel);
  if ( htmlSel === undefined ) {
    htmlSel = txtSel;
  }
  // fade out the html div, then fade it back in
  animateShow(htmlSel, [1.0, 700, 0.3, 600, 0.3, 700, 1.0]);
  // wait 2000ms (for button animation), then show the notice, then hide it
  animateShow(msgSel, [0.0, 2000, 0.0, 2000, 1.0, 3000, 1.0, 1000, 0.0]);
}

var codeIsDirty = false;

function onCodeChange()
{
  codeIsDirty = true;
  document.getElementById("preview-canvas").innerHTML
    = document.getElementById("code").value;
}

function writeCode(enc)
{
  // check if the code manually modified by the user
  if ( codeIsDirty ) {
    var ans = confirm("将要重写代码，继续？");
    if ( !ans ) return;
  }

  var server = document.getElementById("inp-server").value,
      url = server;

  if ( server === "" ) { // use the current page as redir server
    var s = location.href;
    url = s; // address bar
    var q = s.indexOf("?"); // look for "?"
    if ( q >= 0 ) url = s.slice(0, q);
  }

  var args = [], info = {}, tr;

  enc = document.getElementById("inp-encoding").value;

  // we try several rounds to avoid encoding failure
  for ( tr = 0; tr < 3; tr++ ) {
    URIEncodingError = 0;

    if ( enc !== "0" ) {
      // enc parameter needs to be the first
      args.push("enc=" + enc);
    }

    var type = document.getElementById("inp-media-type").value;
    args.push( "type=" + URIEncode(type, enc) );
    info["type"] = type;

    var src = document.getElementById("inp-media-src").value,
        src0 = src;
    if ( src === "" ) {
      src = MediaCom.defMedia[type + "Src"];
    }
    args.push( "src=" + URIEncode(src, enc, 1) );
    info["src"] = src;

    var opts = '';
    if ( type === "video" ) {
      var poster = document.getElementById("inp-video-poster").value;
      if ( poster === "" && src0 === "" ) {
        poster = MediaCom.defMedia["videoPoster"];
      }
      if ( poster !== "" ) {
        args.push( "poster=" + URIEncode(poster, enc, 1) );
        info["poster"] = poster;
      }

      var loop = document.getElementById("inp-video-loop").checked;
      if ( !loop ) opts += 'L';

      var autoplay = document.getElementById("inp-video-autoplay").checked;
      if ( autoplay ) opts += 'a';
    } else if ( type === "audio" ) {

      var loop = document.getElementById("inp-audio-loop").checked;
      if ( loop ) opts += 'l';

      var autoplay = document.getElementById("inp-audio-autoplay").checked;
      if ( autoplay ) opts += 'a';
    }

    info["opts"] = opts;
    if ( opts !== '' ) {
      args.push( "opts=" + URIEncode(opts, enc) );
    }

    var style = document.getElementById("inp-style").value;
    args.push( "style=" + URIEncode(style, enc) );
    info["style"] = style;

    // let the title and descr be the last arguments

    // add "title" into `info` the container is not collapsed
    var titleContainer = document.getElementById("inp-media-title-container");
    if (titleContainer.className.indexOf("collapsed") < 0) {
      var title = document.getElementById("inp-media-title").value;
      if ( title !== "" ) {
        args.push( "title=" + URIEncode(title, enc) );
        info["title"] = title;
      }
    }

    var descrContainer = document.getElementById("inp-media-descr-container");
    if (descrContainer.className.indexOf("collapsed") < 0) {
      var descr = document.getElementById("inp-media-descr").value;
      if ( descr !== "" ) {
        args.push( "descr=" + URIEncode(descr, enc) );
        info["descr"] = descr;
      }
    }

    if ( URIEncodingError == 0 ) {
      break;
    } else {
      if ( enc === "3" ) {
        console.log("Fallback encoding 3 => 2");
        enc = "2";
      } else if ( enc === "2" ) {
        console.log("Fallback encoding 2 => 0");
        enc = "0";
      } else {
        break;
      }
      document.getElementById("inp-encoding").value = enc;
      URIEncodingError = 0;
    }
  }

  var argls = args.join("&");
  url += "?" + argls;

  document.getElementById("long-url").value = url;
  document.getElementById("long-url-length").innerHTML = url.length;
  showLongURL(url);

  // render for preview
  render(info);

  return url;
}

function getShortURL()
{
  var lurl = document.getElementById('long-url').value;
  if ( lurl === "" ) return 1;
  var type = document.getElementById('inp-surl-type').value;

  var btn = document.getElementById('surl-gen-btn');
  btn.disabled = true;

  shortenURL(lurl, type, function(surl){
    showShortURL(surl);
    btn.disabled = false;
  });
  return 0;
}

// handle address bar arguments
function handleHref()
{
  var s = location.href; // address bar
  var p = s.indexOf("?");
  if ( p < 0 ) return;
  s = s.slice(p+1);
  var x = s.split("&"), i;
  for ( i = 0; i < x.length; i++ ) {
    var y = x[i].toLowerCase().trim().split("=");
    var key = y[0], val = y[1];
    if ( key == "showlg" ) {
      showLinkGenerator = ( val !== '0' );
    }
    if ( key === "style" ) {
      document.getElementById("inp-style").value = val;
    }
  }
  showOrHide('#link-generator', showLinkGenerator);
  showOrHide('.lg-only', showLinkGenerator);
}

window.onload = function() {
  handleHref();
  var info = getInput();
  if ( info["src"] !== undefined ) {
    // if the user input is given, show the demo box
    document.getElementById("gen-page").style.display = "none";
    document.getElementById("demo-page").style.display = "";
    // render the media according to the user input
    render(info);
  } else { // generator
    initFoldableInputs(".inp-foldable");
    // if no user input is given show the generation box
    document.getElementById("gen-page").style.display = "";
    document.getElementById("demo-page").style.display = "none";
    writeCode();
  }
};

