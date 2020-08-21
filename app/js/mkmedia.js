"use strict";

var defMedia = {
  "audio-src": "https://i3.vzan.cc/upload/audio/mp3/20200614/d1c2588412784fa7a2baf8b73242c99a.mp3", // water-moon-zen-heart, 17s
  "video-src": "https://i3.vzan.cc/upload/video/mp4/20200614/82a09afb5f0548c7a0de4d8d1fd36a65.mp4", // fyfy 4
  "video-poster": "https://i2.vzan.cc/upload/image/jpg/20200614/77e2f7393bde43238cf3304338446ce5.jpg", // fyfy 4
  "image-src": "https://i.postimg.cc/Kj5t4RyX/lotus1.jpg",
};

var titleTemplates = {
  'simple': '<p style="color:#222;font-size:20px;font-weight:bold;margin:20px 5%;text-align:center;padding:0 5%">{title}</p>',

  'darkred': '<div style="padding:2px;border:1px solid #b21;border-radius:5px;margin:1em auto;width:760px;max-width:80%">'
    + '<div style="padding:0.5em 1em;border-radius:5px;background-color:#b21;color:#fff;font-size:16px;font-weight:bold;text-align:center;letter-spacing:0.1em">{title}</div></div>',

  'pink': '<section style="padding:30px 0px"><p style="margin:0px 5% 20px 5%;padding:15px 2em;border-radius:3px;color:#fff;background-color:rgb(240,120,140);box-shadow:0.1em 0.1em 0.2em #caa;line-height:1.2;font-size:16px;font-weight:bold;text-shadow:1px 1px 5px rgba(80,0,0,0.3);text-align:center;">{title}</p></section>',

  'orange': '<section style="padding:30px 0px"><p style="width:96%;margin:auto;max-width:800px;margin-bottom:20px;padding:10px 5px;color:rgb(128,80,4);background-image:linear-gradient(to bottom,rgb(245,230,164),rgb(240,152,23));text-shadow:3px 4px 5px rgb(255,235,148);border:1px solid rgb(238,220,110);line-height:1.7;font-size:18px;font-weight:bold;text-align:center;">{title}</p></section>',

  'golden': '<section style="margin:0px;"><section style="background:linear-gradient(120deg, rgba(255,240,0,0.1) 0%, rgba(255,240,0,0.8) 20% 50%, rgba(255,240,0,0.6) 70%, transparent 100%);padding:0px 30px 40px 0px;width:100%;min-width:200px;"><section style="color:#fff;font-size:18px;text-shadow:1px 1px 5px rgba(120,60,0,0.3);background:radial-gradient(circle at 10% 20%, rgba(255,255,255,0.2) 0%,rgba(255,150,0,1.0) 20%,rgba(255,150,0,1.0) 80%, rgba(255,180,0,0.9) 100%);box-shadow:0px 0px 1px rgba(255,255,255,0.3),0px 0px 3px rgba(200,200,150,0.7);border-radius:0px 0px 40px 0px;padding:40px 1em 50px 1em;line-height:1.5;letter-spacing:0.05em;font-weight:bold;text-align:center;">{title}</section></section></section>',

  'red': '<section style="margin:0px;padding:30px 0px"><p style="background-color:rgb(200,50,30);background:linear-gradient(90deg,rgb(200,50,30) 0%,rgb(240,10,10) 40% 70%,rgb(200,50,30) 100%);box-shadow:1px 1px 3px rgba(200,50,30,0);text-align:center;padding:0px 20px;line-height:1.8;position:relative;margin:auto;width:800px;max-width:100%;"><span style="display:block;font-size:16px;font-weight:bold;color:#fff;text-shadow:1px 1px 4px rgba(0,0,0,0.3);background-color:rgba(255,200,255,0.15);padding:0.8em 2em;letter-spacing:0.05em;">{title}</span></p></section>',

  'blue': '<p style="width:92%;margin:auto;max-width:760px;margin-bottom:2em;padding:0.8em 10% 0.8em 10%;border-radius:0px 0px 5px 5px;color:#fff;background:linear-gradient(150deg,rgba(20,70,120,0.9) 0%,rgba(50,120,250,0.9) 20% 70%,rgba(20,90,150,0.9) 100%);box-shadow:0.2em 0.05em 0.3em #79c;line-height:1.6;font-size:16px;font-weight:700;letter-spacing:0.1em;text-shadow:0px -1px 1px rgba(0,0,100,0.3);text-align:center;">{title}</p>',

  '': ''
};

var descrTemplates = {
  'simple': '<p style="color:#222;font-size:16px;margin:20px 5%;line-height:1.5;letter-spacing:0.05em">{descr}</p>',

  'darkred': '<p style="color:#400;background-color:rgba(255,255,255,0.6);box-shadow:1px 1px 1px rgba(240,150,150,0.2);font-size:14px;margin:20px 5%;padding:0.5em 1em;line-height:1.8;border-radius:4px;">{descr}</p>',

  'pink': '<p style="margin:20px 5%;padding:15px;border-radius:3px;color:#600;background-color:rgba(255,250,253,0.8);box-shadow:0.1em 0.1em 0.2em rgba(240,180,180,0.5);line-height:1.5;font-size:16px;">{descr}</p>',

  'orange': '<p style="color:rgb(113,33,33);background-color:rgb(251,241,214);font-size:18px;line-height:1.5;margin:20px 2%;padding:10px">{descr}</p>',

  'golden': '<p style="background:linear-gradient(150deg, rgba(255,253,240,0.9) 0%, rgba(255,250,230,0.8) 100%);color:#630;padding:1em;font-size:16px;letter-spacing:0.07em;line-height:1.6;margin:20px 3%;border:1px solid rgba(255,220,0,0.7);border-width:1px 0px 0px 20px;border-radius:0px 0px 10px 0px;box-shadow:3px 3px 3px rgba(200,200,50,0.3);">{descr}</p>',

  'red': '<p style="color:#622;text-shadow:0px 0px 1px rgba(255,255,255,0.5);letter-spacing:0.08em;background-image:linear-gradient(90deg,rgba(255,250,230,0.9) 0%,rgba(255,255,255,0.7) 40% 70%,rgba(255,250,230,0.9) 100%);border-left:10px solid rgba(255,0,0,0.5);font-size:16px;padding:0.8em 1.6em;line-height:1.5;border-radius:1px;margin:40px 5%;position:relative;">{descr}</p>',

  'blue': '<p style="width:90%;margin:auto;max-width:800px;font-size:16px;color:rgb(0,20,50);margin-top:50px;margin-bottom:50px;line-height:1.5;padding:30px 30px;position:relative"><span style="display:inline-block;position:absolute;top:10px;left:0px;width:30px;height:1px;background-color:rgb(100,150,255)"></span><span style="display:inline-block;position:absolute;top:0px;left:10px;width:1px;height:30px;background-color:rgb(100,150,255)"></span>{descr}<span style="display:inline-block;position:absolute;bottom:10px;right:0px;width:30px;height:1px;background-color:rgb(100,150,255)"></span><span style="display:inline-block;position:absolute;bottom:0px;right:10px;width:1px;height:30px;background-color:rgb(100,150,255)"></span></p>',

  '': ''
};

var backgroundTemplates = {
  'simple': 'background-color:#fff',

  'darkred': 'background-image:linear-gradient(160deg,rgba(255,200,200,0.3) 0%,rgba(255,255,250,1.0) 25% 45%,rgba(255,200,200,0.5) 70%,rgba(255,255,235,0.8) 85%,rgba(255,200,200,0.5) 100%)',

  'pink': 'background-image:radial-gradient(circle,rgba(255,150,150,0.3) 0%,rgba(255,245,245,0.3) 70%,rgba(255,255,255,0.5) 80%,rgba(255,220,200,0.3) 100%)',

  'orange': 'background-color:rgb(251,241,214)',

  'golden': 'background-image:radial-gradient(circle at 80% 20%,rgba(255,255,240,0.8) 0%,rgba(0,0,0,0) 30%), radial-gradient(circle at 20% 80%,rgba(255,255,240,0.8) 0%,rgba(0,0,0,0) 40%), linear-gradient(to top left,rgba(0,0,0,0) 40%,rgba(255,255,240,0.7) 50%,rgba(0,0,0,0) 60%); background-color:rgba(255,240,0,1.0)',

  'red': 'background:radial-gradient(circle, rgba(255,240,230,0.5) 0%,rgba(255,255,240,1.0) 60%,rgba(255,200,100,0.2) 80%,rgba(255,140,100,0.1) 100%)',

  'blue': 'background:linear-gradient(-20deg,rgba(220,240,255,0.3) 0%,rgba(255,255,255,1.0) 80%,rgba(220,240,255,0.3) 100%);',

  '': ''
};

var templates = {
  "audio": '{title-html}<p style="margin:0px 0px 30px 0px"><audio src="{src}" {attrs}controls="controls" style="width:100%"></audio></p>{descr-html}',

  "video": '{title-html}<p style="margin:0px 0px 30px 0px;text-align:center;padding:0px 2%"><video src="{src}" poster="{poster}" {attrs}preload="none" controls="controls" webkit-playsinline="" playsinline="" style="background-color:black;width:800px;max-width:100%;"></video></p>{descr-html}',

  "image": '{title-html}<p style="text-align:center;margin:0px 0px 30px 0px"><img src="{src}" style="max-width:100%"/></p>{descr-html}',

  "": ''
};

var hideLinkGenerator = false;

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

function getType(info) {
  var type = info["type"];
  var defType = "audio";

  if ( type !== undefined ) {
    return type;
  } else {
    // start guessing
    var src = info["src"];
    var p = src.indexOf("?");
    if ( p >= 0 ) src = src.slice(0, p);
    if ( info["poster"] !== undefined ) {
      return "video";
    }
    // get the extension
    p = src.lastIndexOf(".");
    if ( p < 0 ) {
      return defType;
    }
    var ext = src.slice(p + 1).toLowerCase();
    // https://en.wikipedia.org/wiki/Video_file_format
    var videoExts = ["webm", "flv", "vob", "ogv", "avi", "wmv",
      "yuv", "rm", "rmvb", "asf", "amv",
      "mp4", "m4p", "m4v", "mpg", "mp2", "mpeg", "mpe", "mpv",
      "3gp", "3g2", "mxf", "roq", "nsv", "f4v", "f4p", "f4a", "f4b"];
    // https://en.wikipedia.org/wiki/Audio_file_format
    var audioExts = ["mp3", "3gp", "aa", "aac", "aax", "amr", "au", "m4a", "m4b", "m4p",
        "ogg", "oga", "mogg", "wav", "wma", "mv", "webm", "cda"];
    // https://en.wikipedia.org/wiki/Image_file_formats
    var imageExts = ["jpg", "jpeg", "tiff", "tif", "gif", "bmp", "png",
      "ppm", "pgm", "pbm", "pnm", "webp", "ico", "drw", "pcx", "img", "bpg",
      "psd", "psp", "xcf", "cd5", "cpt", "pdn",
      "cgm", "svg", "cdr", "odg", "eps", "pdf", "ps", "pict", "swf"];
    if ( videoExts.indexOf(ext) >= 0 ) {
      return "video";
    } else if ( audioExts.indexOf(ext) >= 0 ) {
      return "audio";
    } else if ( imageExts.indexOf(ext) >= 0 ) {
      return "image";
    }
    return defType;
  }
}

function subKeys(template, tab)
{
  var s, k, re;
  s = template;
  for ( k in tab ) {
    if ( tab.hasOwnProperty(k) ) {
      re = new RegExp("{" + k + "}", 'gi');
      s = s.replace(re, tab[k]);
    }
  }
  return s;
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

function renderTemplate(temp, info)
{
  var s = subKeys(temp, info);
  if ( isDemoMode() ) {
    document.getElementById("demo-canvas").innerHTML = s;
  } else { // preview mode
    document.getElementById("preview-canvas").innerHTML = s;
    document.getElementById("code").value = s;
  }
  return s;
}



function renderTextComponent(info, key, templates)
{
  var val = info[key];
  if ( val === undefined ) return "";

  // escape the value
  val = escapeHTML( val );
  info[key] = val;

  var style = info["style"] || "simple";
  if ( !templates[style] ) {
    style = "simple";
  }
  return subKeys(templates[style], info);
}

function renderTitle(info)
{
  return renderTextComponent(info, "title", titleTemplates);
}

function renderDescr(info)
{
  var s0 = info["descr"];
  if ( s0 === undefined ) return "";
  // paragraph is separated by two new lines
  var x = s0.split("\n\n"), i, s = "";
  // render paragraph by paragraph
  for ( i = 0; i < x.length; i++ ) {
    info["descr"] = x[i];
    var s1 = renderTextComponent(info, "descr", descrTemplates);
    s += s1;
  }
  return s;
}

function renderBackground(info)
{
  var style = info["style"] || "simple";
  if ( !backgroundTemplates[style] ) {
    style = "simple";
  }
  var bgs = backgroundTemplates[style];
  if ( isDemoMode() ) {
    document.getElementsByTagName("BODY")[0].style.background = "transparent";
    var el = document.getElementById("demo-page");
    el.style = bgs;
  } else {
    if ( !hideLinkGenerator ) {
      // apply the background only for link generation
      // because the code doesn't contain the background part
      var el = document.getElementById("preview-wrapper");
      el.style = bgs;
    }
  }
}

function renderAudio(info)
{
  var opts = info["opts"], attrs = '';
  if ( opts !== undefined && opts !== "" ) {
    if ( opts.indexOf("l") >= 0 ) {
      attrs += 'loop="loop" ';
    }
    if ( opts.indexOf("a") >= 0 ) {
      attrs += 'autoplay="autoplay" ';
    }
  }
  info['attrs'] = attrs;

  return renderTemplate(templates["audio"], info);
}

function renderVideo(info)
{
  var opts = info["opts"] || "", attrs = '';
  if ( opts.indexOf("L") < 0 ) {
    attrs += 'loop="loop" ';
  }
  if ( opts.indexOf("a") >= 0 ) {
    attrs += 'autoplay="autoplay" ';
  }
  info['attrs'] = attrs;

  if ( info["poster"] === undefined ) {
    info["poster"] = "";
  }
  return renderTemplate(templates["video"], info);
}

function renderImage(info)
{
  return renderTemplate(templates["image"], info);
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

  info["title-html"] = renderTitle(info);
  info["descr-html"] = renderDescr(info);

  var type = getType(info);
  if ( type === "audio" ) {
    renderAudio(info);
  } else if ( type === "video" ) {
    renderVideo(info);
  } else if ( type === "image" ) {
    renderImage(info);
  } else {
    showError();
  }
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

function copyAnimated(txtId, btnId, msgId, htmlId)
{
  copyTextToClipboard(document.getElementById(txtId).value, btnId);
  if ( htmlId === undefined )
    htmlId = txtId;
  // fade out the html div, then fade it back in
  animateShow(htmlId, [1.0, 700, 0.3, 600, 0.3, 700, 1.0]);
  // wait 2000ms (for button animation), then show the notice, then hide it
  animateShow(msgId, [0.0, 2000, 0.0, 2000, 1.0, 3000, 1.0, 1000, 0.0]);
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
  if ( codeIsDirty ) {
    var ans = confirm("将要重写代码，继续？");
    if ( !ans ) return;
  }

  var url = "https://app.bhffer.com/mkmedia.html"
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

    var src = document.getElementById("inp-media-src").value, src0 = src;
    if ( src === "" ) {
      src = defMedia[type + "-src"];
    }
    args.push( "src=" + URIEncode(src, enc, 1) );
    info["src"] = src;

    var opts = '';
    if ( type === "video" ) {
      var poster = document.getElementById("inp-video-poster").value;
      if ( poster === "" && src0 === "" ) {
        poster = defMedia["video-poster"];
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
    var title = document.getElementById("inp-media-title").value, stitle = title;
    if ( stitle !== "" ) {
      args.push( "title=" + URIEncode(stitle, enc) );
      info["title"] = title;
    }
    var descr = document.getElementById("inp-media-descr").value, sdescr = descr;
    if ( sdescr !== "" ) {
      args.push( "descr=" + URIEncode(sdescr, enc) );
      info["descr"] = descr;
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
  if ( p < 0 ) return ret;
  s = s.slice(p+1);
  var x = s.split("&"), i;
  for ( i = 0; i < x.length; i++ ) {
    var y = x[i].toLowerCase().trim().split("=");
    var key = y[0], val = y[1];
    if ( key == "hidelg" ) {
      hideLinkGenerator = ( val !== '0' );
    }
    if ( key === "style" ) {
      document.getElementById("inp-style").value = val;
    }
  }
  showOrHide('#link-generator', !hideLinkGenerator);
  showOrHide('.lg-only', !hideLinkGenerator);
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
    // if no user input is given show the generation box
    document.getElementById("gen-page").style.display = "";
    document.getElementById("demo-page").style.display = "none";
    writeCode();
  }
};

