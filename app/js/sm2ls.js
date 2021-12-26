"use strict";

var latestCDNVersion = "0.1.34";

var frameworkTemplate = '<section style="padding:20px 1%;margin:0;background-color:{bg-color}">\n'
 + '<section style="margin:0 0 15px 0;">{title-code}</section>\n'
 + '{player-code}'
 + '</section>\n';

var titleTemplates = {
  'simple': '<p style="color:#222;font-size:{font-size};font-weight:bold;margin:20px 5%;text-align:center;padding:0 5%">{title}</p>',

  'darkred':'<div style="padding:2px;border:1px solid #b21;border-radius:5px;margin:1em auto;width:760px;max-width:80%">'
    + '<div style="padding:0.5em 1em;border-radius:5px;background-color:#b21;color:#fff;font-size:{font-size};font-weight:bold;text-align:center;letter-spacing:0.1em">{title}</div></div>',

  'pink': '<section style="padding:30px 0px"><p style="margin:0px 5% 20px 5%;padding:15px 2em;border-radius:3px;color:#fff;background-color:rgb(240,120,140);box-shadow:0.1em 0.1em 0.2em #caa;line-height:1.2;font-size:{font-size};font-weight:bold;text-shadow:1px 1px 5px rgba(80,0,0,0.3);text-align:center;">{title}</p></section>',

  'orange': '<section style="padding:30px 0px"><p style="width:96%;margin:auto;max-width:800px;margin-bottom:20px;padding:10px 5px;color:rgb(128,80,4);background-image:linear-gradient(to bottom,rgb(245,230,164),rgb(240,152,23));text-shadow:3px 4px 5px rgb(255,235,148);border:1px solid rgb(238,220,110);line-height:1.7;font-size:{font-size};font-weight:bold;text-align:center;">{title}</p></section>',

  '': ''
};

var sm2BarUITemplates = {
  // default files installed on forums
  "header": ''
    //+ '<link rel="stylesheet" href="./sm2/Sound/bar-ui.css"/>\n'
    //+ '<script type="text/javascript" src="./sm2/Sound/js/soundmanager2.js"></script>\n'
    //+ '<script type="text/javascript" src="./sm2/Sound/js/bar-ui.js"></script>\n',
    // don't use the .min versions, for they will confuse mbuembed.js
    + '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/prgwrtr/cdn/app/sm2/Sound/bar-ui.css"/>\n'
    + '<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/prgwrtr/cdn/app/sm2/Sound/js/soundmanager2.js"></script>\n'
    + '<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/prgwrtr/cdn/app/sm2/Sound/js/bar-ui.js"></script>\n',

  "simple-installation-code": ''
    + '<section>\n'
    + '<style>{plugin-quick-fix-css}</style>\n'
    + '<link rel="stylesheet" href="{plugin-css}"/>\n'
    // even though the settings in patch css are the same as the main css
    // the patch can help prevent them from being overridden
    // by the system (if any) style sheets, which appears later
    + '<link rel="stylesheet" href="{plugin-css-patch}"/>\n'
    + writeSneakyJSLoader('{plugin-js-installer}')
    + '</section>',

  "smart-installation-code": ''
    + '<section>\n'
    + '<style>{plugin-quick-fix-css}</style>\n'
    + '<link rel="stylesheet" href="{plugin-css-patch}"/>\n'
    + writeSneakyJSLoader('{plugin-embedder-installer}')
    + '</section>',

  "sneaky-installation-code": ''
    + writeSneakyJSLoader(['{plugin-quick-fix-css-installer}', '{plugin-embedder-installer}']),

  "player": ''
    + '<div class="sm2-bar-ui playlist-open full-width {options}" style="font-size:{font-size};line-height:1;letter-spacing:0px">\n'
    + ' <div class="bd sm2-main-controls" style="background-color: {bar-color}">\n'
    + '  <div class="sm2-inline-gradient"></div>\n'
    + '  <div class="sm2-inline-element sm2-button-element">\n'
    + '   <div class="sm2-button-bd">\n'
    + '    <a href="#play" class="sm2-inline-button sm2-icon-play-pause">Play / pause</a>\n'
    + '   </div>\n'
    + '  </div>\n'
    + '  <div class="sm2-inline-element sm2-inline-status">\n'
    + '   <div class="sm2-playlist">\n'
    + '    <div class="sm2-playlist-target" style="font-size:90%">\n'
    + '    </div>\n'
    + '   </div>\n'
    + '   <div class="sm2-progress">\n'
    + '    <div class="sm2-row">\n'
    + '    <div class="sm2-inline-time">0:00</div>\n'
    + '     <div class="sm2-progress-bd">\n'
    + '      <div class="sm2-progress-track" style="background-color:rgba(0,0,0,0.4)">\n'
    + '       <div class="sm2-progress-bar"></div>\n'
    + '       <div class="sm2-progress-ball"><div class="icon-overlay"></div></div>\n'
    + '      </div>\n'
    + '     </div>\n'
    + '     <div class="sm2-inline-duration">0:00</div>\n'
    + '    </div>\n'
    + '   </div>\n'
    + '  </div>\n'
    + '  <div class="sm2-inline-element sm2-button-element sm2-volume">\n'
    + '   <div class="sm2-button-bd">\n'
    + '    <span class="sm2-inline-button sm2-volume-control volume-shade"></span>\n'
    + '    <a href="#volume" class="sm2-inline-button sm2-volume-control">volume</a>\n'
    + '   </div>\n'
    + '  </div>\n'
    + '{bar-buttons}'
    + '  <div class="sm2-inline-element sm2-button-element sm2-menu">\n'
    + '   <div class="sm2-button-bd">\n'
    + '     <a href="#menu" class="sm2-inline-button sm2-icon-menu">menu</a>\n'
    + '   </div>\n'
    + '  </div>\n'
    + ' </div>\n'
    + ' <div class="bd sm2-playlist-drawer sm2-element" style="background-color:{bg-color}">\n'
    + '  <div class="sm2-playlist-wrapper">\n'
    + '    <ul class="sm2-playlist-bd{scroll-long-title}">\n'
    + '{list}'
    + '    </ul>\n'
    + '  </div>\n'
    + ' </div>\n'
    + '</div>\n',

  'prev-button': ''
    + '  <div class="sm2-inline-element sm2-button-element">\n'
    + '   <div class="sm2-button-bd">\n'
    + '    <a href="#prev" title="Previous" class="sm2-inline-button sm2-icon-previous">&lt; previous</a>\n'
    + '   </div>\n'
    + '  </div>\n',

  'next-button': ''
    + '  <div class="sm2-inline-element sm2-button-element">\n'
    + '   <div class="sm2-button-bd">\n'
    + '    <a href="#next" title="Next" class="sm2-inline-button sm2-icon-next">&gt; next</a>\n'
    + '   </div>\n'
    + '  </div>\n',
};

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


function escapeHTML(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\n/g, "<br/>");
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


function getSelectedOption(selector)
{
  var sel = document.querySelector(selector);
  if (sel) {
    for (var i = 0; i < sel.options.length; i++) {
      var opt = sel.options[i];
      if (opt.selected) {
        return opt;
      }
    }
  }
  return null;
}

function getPluginCode(info)
{
  // manipulate the version
  var ver = document.getElementById("inp-plugin-version").value, v, forced;
  v = ver.split("-");
  ver = v[0];
  forced = v[1];
  if ( ver === "this" ) {
    ver = lastestCDNVersion;
  }

  var cssPatchFn = "css/bar-ui-patch.css",
      cssPatchPath = "";
  var cssFn = "css/bar-ui.css",
      cssPath = "";
  var jsFn = "js/sm2-bar-ui.js",
      jsPath = "",
      jsVar = "j";
  var embedFn = "js/mbuembed.js",
      embedPath = "",
      embedVar = "e",
      embedCode = "";

  // set the CDN version parameter
  embedCode += 'window.sm2cdnver="' + latestCDNVersion + '";';

  // determine the serverRoot
  var serverOption = getSelectedOption("#inp-plugin-server"),
      serverValue = null,
      serverRoot = undefined;
  if (serverOption) {
    serverValue = serverOption.value;
    serverRoot = serverOption.dataset.root;
  }

  // If the option does not have the data-root field set in HTML
  // serverRoot would be undefined
  // the value field (serverValue) is not used in this case
  if ( serverRoot === undefined ) {
    if ( serverValue === "cdn" ) {
      serverRoot = "https://cdn.jsdelivr.net/gh/prgwrtr/cdn";
      // this is the default, no need to set the sm2root for other scripts
      if ( (/^[0-9.]+$/.exec(ver) !== null) || ver === "latest" ) { // e.g., ver: "cdn-0.1.3" or "cdn-latest"
        serverRoot += "@" + ver + "/app/";
        // minify JS and CSS
        // jsdelivr provides automatically minified js and css
        cssPatchFn = cssPatchFn.replace(/[.]css$/, ".min.css");
        cssFn = cssFn.replace(/[.]css$/, ".min.css");
        // jsFn is already minimized
        embedFn = embedFn.replace(/[.]js$/, ".min.js");
      } else {
        alert("cdn can't handle version " + ver + " fn " + fn);
      }
    } else if ( serverValue === "this" ) {
      serverRoot = selectServerPath(location.href,
          [/bhffer\.com/, /xljt\.cloud/, /localhost:/],
          "https://app.bhffer.com/");
    } else {
      console.log("Internal Error: unknown plugin server " + serverValue);
    }
  }

  var sm2Path = serverRoot + "sm2/";
  // set the path for loading other scripts
  embedCode += 'window.sm2root="' + sm2Path + '";';

  var tail = '?v=' + latestCDNVersion;

  cssPatchPath = sm2Path + cssPatchFn;
  info["plugin-css-patch"] = cssPatchPath + tail;

  cssPath = sm2Path + cssFn;
  info["plugin-css"] = cssPath + tail;

  jsPath = sm2Path + jsFn;
  info["plugin-js"] = jsPath + tail;

  // embedder script
  embedPath = sm2Path + embedFn;

  // write the script of loading the embedder
  if ( forced === "forced" ) {
    embedCode += embedVar + '.src="' + embedPath + '?t="+Math.floor((new Date())/9e5);';
  } else {
    embedCode += embedVar + '.src="' + embedPath + tail + '";';
  }

  info["plugin-js-installer"] = writeJSInstaller(jsPath + tail, null, jsVar, "sm2baruiOnce");

  info["plugin-embedder-installer"] = writeJSInstaller(null, embedCode, embedVar, "mbuembedOnce");

  // the quick fix css is intended to temporarily
  // fix the faulty default css until the patch css kicks in
  // the height value here 2em is wrong (setting it to the right value 100%
  // will break too many other things). Fortunately it will be overriden by
  // the value in the patch css or the fixed css with stronger rules (important)
  var qf = '.sm2-playlist-bd span.lianhua{width:2em;height:2em;background-size:contain}';
  info["plugin-quick-fix-css"] = qf;
  info["plugin-quick-fix-css-installer"] = writeCSSInstaller(qf);
}

// write the JS code that loads the script at path
function writeJSInstaller(path, code, varS, varOnce)
{
  if ( !varS ) {
    varS = "s";
  }
  if ( !code ) {
    code = varS + '.src="' + path + '";';
  }

  var src = '';
  if ( varOnce ) {
    src += 'if(window.{vo}){return;}else{window.{vo}=1;'.replace(/{vo}/g, varOnce);
  }
  src += 'var {vs}=document.createElement("SCRIPT");'
  src += code;
  src += 'document.body.append({vs});';
  if ( varOnce ) {
    src += '}';
  }
  src = src.replace(/{vs}/g, varS);
  return src;
}

// write the JS code that loads css rules
function writeCSSInstaller(css, varS)
{
  if ( !varS ) {
    varS = 'S';
  }
  var src = 'try{'
    + 'var {var}=document.createElement("style");'
    + 'document.head.appendChild({var});'
    + '{var}={var}.sheet;';

  if ( !Array.isArray(css) ) {
    css = [css,];
  }

  for ( var i = 0; i < css.length; i++ ) {
    src += '{var}.insertRule("' + css[i] + '",{var}.cssRules.length);';
  }
  src += '}catch(e){};';
  src = src.replace(/{var}/g, varS);
  return src;
}

function writeSneakyJSLoader(code)
{
  var src = '<div style="display:none">'
    + '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=" ' // regular gif
    + 'alt="." onload=\'(function(){';

  if ( !Array.isArray(code) ) {
    code = [code,];
  }

  for ( var i = 0; i < code.length; i++ ) {
    src += code[i];
  }

  src += '})()\'></div>\n';
  return src;
}

function writeSM2PlayerCode(info)
{
  var sprev = sm2BarUITemplates["prev-button"];
  var snext = sm2BarUITemplates["next-button"];
  var barButtons = "";
  if ( document.getElementById("inp-prev-btn").checked ) {
    barButtons += sprev;
  }
  if ( document.getElementById("inp-next-btn").checked ) {
    barButtons += snext;
  }
  info["bar-buttons"] = barButtons;

  var installMethod = document.getElementById("inp-install-method").value;
  //var autoInstall = document.getElementById("inp-auto-install").checked;

  var opts = [];
  if ( !document.getElementById("inp-3d-bar").checked ) {
    opts.push("flat");
  }
  //if ( !document.getElementById("inp-volume-btn").checked ) {
    opts.push("no-volume");
  //}
  if ( document.getElementById("inp-item-download").checked ) {
    opts.push("item-download");
  }
  info["options"] = opts.join(" ");

  var scrollLongTitle = document.getElementById("inp-scroll-long-title").checked;
  info["scroll-long-title"] = (scrollLongTitle ? " sm2-playlist-bd-scroll" : "");

  // compile the media list
  var needIcon = document.getElementById("inp-lianhua").checked;
  var scrollLongTitle = document.getElementById("inp-scroll-long-title").checked;
  var arr = getInputList(), i, list = "";
  for ( i = 0; i < arr.length; i++ ) {
    var title = arr[i].title, src = arr[i].src;
    if ( src === "" ) {
      continue;
    }
    if ( title === "" ) {
      title = "&nbsp;"; // placeholder
    }

    if ( installMethod !== "none" ) {
      // standard code, style changes are implemented in the external bar-ui.css or bar-ui-patch.css
      list += '      <li>';
      if ( needIcon ) list += '<span class="lianhua"></span>';
      list += '<a href="' + src + '">' + title + '</a></li>\n';
    } else {
      // compatibility code
      list += '      <li style="background-size:contain;overflow:hidden;white-space:nowrap;background-size:2.5em,contain">';
      if ( needIcon ) list += '<span class="lianhua" style="width:3em;height:2.5em;background-size:contain;background-position:center"></span>';
      list += '<a href="' + src + '" style="background-size:2.5em,contain">';
      if ( scrollLongTitle ) {
        list += '<span style="display:inline-block;width:calc(100% - 4.5em);overflow:auto;white-space:nowrap">' + title + '</span>';
      } else {
        list += title;
      }
      list += '</a></li>\n';
    }
  }
  info["list"] = list;

  var sPlayer = sm2BarUITemplates["player"];
  var s = "", sinstall = "";
  s += subKeys(sPlayer, info);
  if ( installMethod !== "none" ) {
    sinstall = sm2BarUITemplates[installMethod + "-installation-code"];
    getPluginCode(info);
    sinstall = subKeys(sinstall, info);
    s += sinstall;
  }
  return s;
}

function packCode(s)
{
  var x = s.replace(/^\s+|\s+$/g, "").split("\n"), i;
  for ( i = 0; i < x.length; i++ ) {
    x[i] = x[i].replace(/^\s+|\s+$/g, "");
  }
  return x.join("");
}

function updatePreview()
{
  var s = document.getElementById("code").value;
  //document.getElementById("preview-canvas").innerHTML = s;
  var fr = document.getElementById("preview-iframe");
  fr.innerHTML = "";
  fr.srcdoc = "";
  var src = '<html><head><meta charset="utf-8">';
  var env = document.getElementById("inp-env").value;
  if ( env === "forum" ) {
    src += sm2BarUITemplates["header"];
  }
  src += '</head>' + '<body style="margin:0px">' + s + '</body></html>';
  fr.srcdoc = src;
}

var codeIsDirty = false;

function onCodeChange()
{
  codeIsDirty = true;
  updatePreview();
}

function updateDisplayValues()
{
  // update interface
  document.getElementById("font-size-display").innerHTML = document.getElementById("inp-font-size").value;
  document.getElementById("bar-color-display").innerHTML = document.getElementById("inp-bar-color").value;
  document.getElementById("bg-color-display").innerHTML = document.getElementById("inp-bg-color").value;
}

function writeCode()
{
  updateDisplayValues();

  if ( codeIsDirty ) {
    var ans = confirm("将要重写代码，继续？");
    if ( !ans ) return;
  }

  var info = {};
  info["title"] = document.getElementById("inp-media-title").value;
  info["style"] = document.getElementById("inp-style").value;
  var fontSize = document.getElementById("inp-font-size").value;
  info["font-size"] = fontSize + "px";
  var barColor = document.getElementById("inp-bar-color").value;
  info["bar-color"] = barColor;
  var bgColor = document.getElementById("inp-bg-color").value;
  info["bg-color"] = bgColor;

  var s = subKeys(frameworkTemplate, info);
  var sTitle = renderTitle(info);
  var sPlayer = writeSM2PlayerCode(info);
  s = subKeys(s, {'title-code': sTitle, 'player-code': sPlayer});
  if ( document.getElementById("inp-pack-code").checked ) {
    s = packCode(s);
  }
  document.getElementById("code").value = s;
  updatePreview();
  codeIsDirty = false;
}

function resizeIframe() {
  try {
    var obj = document.getElementById("preview-iframe"),
      el = obj.contentWindow.document.documentElement;
    if ( el ) {
      obj.style.height = el.scrollHeight + 'px';
    }
  } catch (e) {
  }
}

function initListInputMode()
{
  switchListInputMode("normal-mode");
}

function switchListInputMode(mode)
{
  var par = document.querySelector("#list-input-mode");
  par.setAttribute("data-mode", mode);
  var modes = par.children, i;
  for ( i = 0; i < modes.length; i++ ) {
    if ( modes[i].id === mode ) {
      modes[i].style.display = "";
    } else {
      modes[i].style.display = "none";
    }
  }
}

function getInputList()
{
  var par = document.querySelector("#list-input-mode");
  var mode = par.getAttribute("data-mode");
  console.log("reading input list from mode", mode);
  if ( mode === "normal-mode" ) {
    return getInputListNormalMode();
  } else if ( mode === "itemized-mode" ) {
    return getInputListItemizedMode();
  } else {
    console.log("Error: unknown input-list mode", mode);
  }
}

function getInputListNormalMode()
{
  var slist = document.getElementById("inp-list").value;
  slist = slist.replace(/\s+$/g, ""); // remove trailing spaces;
  var arr = [], i;
  // replace blank lines with spaces by a single line-break
  slist = slist.replace(/[ \t]+\n/g, "\n");
  slist = slist.split("\n\n");
  for ( i = 0; i < slist.length; i++ ) {
    var x = slist[i].split("\n"), title, src;
    for ( var j = 0; j < x.length; j++ ) {
      x[j] = x[j].trim();
    }
    if ( x.length >= 2 ) {
      title = escapeHTML(x[0]);
      src = x[1];
    } else if ( x[0].slice(0,4) === "http" || x[0].slice(0,2) === "//" ) {
      title = "";
      src = x[0];
    } else {
      continue;
    }
    arr.push( { "title": title, "src": src} );
  }
  return arr;
}

function getInputListItemizedMode()
{
  var title = document.getElementById("inp-list-title").value;
  title = title.replace(/\s+$/g, "").split("\n");
  var src = document.getElementById("inp-list-src").value;
  src = src.replace(/\s+$/g, "").split("\n");
  var arr = [], i, n;
  n = Math.max(title.length, src.length);
  for ( i = 0; i < n; i++ ) {
    var t = title[i];
    if ( t === undefined ) {
      t = "";
    }
    var s = src[i];
    if ( s === undefined ) {
      s = "";
    }
    arr.push( { "title": t, "src": s } );
  }
  return arr;
}

window.onload = function() {
  initListInputMode();

  writeCode();

  // allow the preview iframe to dynamically adjust its height
  //  https://stackoverflow.com/questions/9975810/make-iframe-automatically-adjust-height-according-to-the-contents-without-using
  setInterval(resizeIframe, 200); // readjust height every 0.2s

  document.getElementById("inp-plugin-version-this").innerHTML += "v" + latestCDNVersion;
  //document.getElementById("header-code").value = sm2BarUITemplates["header"];
};

