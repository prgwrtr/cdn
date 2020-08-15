"use strict";

var frameworkTemplate = '<section style="padding:20px 1%;margin:0;background-color:{bg-color}">\n'
 + '<section style="margin:0 0 15px 0;">{title-code}</section>\n'
 + '{player-code}'
 + '</section>\n';

var titleTemplates = {
  'simple': '<p style="color:#222;font-size:{font-size};font-weight:bold;margin:20px 5%;text-align:center;padding:0 5%">{title}</p>',

  'darkred': '<p style="text-align:center;margin:0px;padding:16px 10%;">'
    + '<span style="display:inline-block;padding:2px;border:1px solid #b21;border-radius:5px;">'
    + '<span style="display:inline-block;padding:3px 30px;border-radius:5px;background-color:#b21;color:#fff;font-size:{font-size};font-weight:bold;text-align:center;letter-spacing:0.1em;">{title}</span></span></p>',

  'pink': '<section style="padding:30px 0px"><p style="margin:0px 5% 20px 5%;padding:15px 2em;border-radius:3px;color:#fff;background-color:rgb(240,120,140);box-shadow:0.1em 0.1em 0.2em #caa;line-height:1.2;font-size:{font-size};font-weight:bold;text-shadow:1px 1px 5px rgba(80,0,0,0.3);text-align:center;">{title}</p></section>',

  'orange': '<section style="padding:30px 0px"><p style="width:96%;margin:auto;max-width:800px;margin-bottom:20px;padding:10px 5px;color:rgb(128,80,4);background-image:linear-gradient(to bottom,rgb(245,230,164),rgb(240,152,23));text-shadow:3px 4px 5px rgb(255,235,148);border:1px solid rgb(238,220,110);line-height:1.7;font-size:{font-size};font-weight:bold;text-align:center;">{title}</p></section>',

  '': ''
};

var sm2BarUITemplates = {
  // default files installed on forums
  "header": ''
    + '<link rel="stylesheet" href="./sm2/Sound/bar-ui.css"/>\n'
    + '<script type="text/javascript" src="./sm2/Sound/js/soundmanager2.js"></script>\n'
    + '<script type="text/javascript" src="./sm2/Sound/js/bar-ui.js"></script>\n',

  "installation-code": ''
    + '<div><img src="https://i2.vzan.cc/upload/image/gif/20200710/543924e9c26b4a2da1e41f93e5e2d6f2.gif" '
    +   'alt="正在加载代码..." onload=\''
    // the following rule is important to avoid the indentation problem of the lianhua icon
    // if the default bar-ui.css is present, it takes time for mbuembed.min.js to kick in.
    +   'document.styleSheets[0].insertRule("span.lianhua{width:2.55em !important;height:2.55em !important}",0);'
    +   's=document.createElement("SCRIPT");'
    // this CDN version is fastest, but may be out-dated
    +   's.src="https://cdn.jsdelivr.net/gh/prgwrtr/cdn@0.1.0/app/sm2/js/mbuembed.min.js";'
    // this allows the user to load the latest mbuembed.js, but is slower
    //+   's.src="https://app.bhffer.com/sm2/js/mbuembed.js?v=0.01";'
    // this is for local testing
    //+   's.src="./sm2/js/mbuembed.js";'
    +   'document.body.append(s);'
    +   'this.parentNode.innerHTML="";'
    +   '\'>'
    + '</div>\n',

  "player": ''
    + '<div class="sm2-bar-ui playlist-open full-width {options}" style="font-size:{font-size};line-height:1;letter-spacing:0px">\n'
    + ' <div class="bd sm2-main-controls" style="background-color: {bar-color}">\n'
    + '  <div class="sm2-inline-texture"></div>\n'
    + '  <div class="sm2-inline-gradient"></div>\n'
    + '  <div class="sm2-inline-element sm2-button-element">\n'
    + '   <div class="sm2-button-bd">\n'
    + '    <a href="#play" class="sm2-inline-button sm2-icon-play-pause">Play / pause</a>\n'
    + '   </div>\n'
    + '  </div>\n'
    + '  <div class="sm2-inline-element sm2-inline-status">\n'
    + '   <div class="sm2-playlist">\n'
    + '    <div class="sm2-playlist-target" style="font-size:85%">\n'
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
    + '  <div class="sm2-inline-texture">\n'
    + '   <div class="sm2-box-shadow"></div>\n'
    + '  </div>\n'
    + '  <div class="sm2-playlist-wrapper">\n'
    + '    <ul class="sm2-playlist-bd">\n'
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

  var autoInstall = document.getElementById("inp-auto-install").checked;

  var opts = [];
  if ( !document.getElementById("inp-3d-bar").checked ) {
    opts.push("flat");
  }
  //if ( !document.getElementById("inp-volume-btn").checked ) {
    opts.push("no-volume");
  //}
  info["options"] = opts.join(" ");

  // compile the media list
  var needIcon = document.getElementById("inp-lianhua").checked;
  var list = "", i, x, title, url;
  var slist = document.getElementById("inp-list").value.replace(/^\s+|\s+$/g, "");
  // replace blank lines with spaces by a single line-break
  slist = slist.replace(/[ \t]+\n/g, "\n");
  slist = slist.split("\n\n");
  var truncLongTitle = document.getElementById("inp-trunc-long-title").checked;
  for ( i = 0; i < slist.length; i++ ) {
    x = slist[i].replace(/^\s+|\s+$/g, "").split("\n");
    if ( x.length >= 2 ) {
      title = x[0];
      url = x[1];
    } else if ( x[0].slice(0,4) === "http" || x[0].slice(0,2) === "//" ) {
      title = "";
      url = x[0];
    } else {
      continue;
    }

    if ( autoInstall ) {
      // standard code, style changes are implemented in the external bar-ui.css or bar-ui-patch.css
      list += '      <li>';
      if ( needIcon ) list += '<span class="lianhua"></span>';
      list += '<a href="' + url + '">' + title + '</a></li>\n';
    } else {
      // compatibility code
      list += '      <li style="background-size:contain;overflow:hidden;white-space:nowrap">';
      if ( needIcon ) list += '<span class="lianhua" style="width:3em;height:2.5em;background-size:contain;background-position:center"></span>';
      list += '<a href="' + url + '" style="background-size:contain">';
      if ( truncLongTitle ) {
        list += '<span style="display:inline-block;width:calc(100% - 4.5em);overflow:hidden;white-space:nowrap;text-overflow:ellipsis">' + title + '</span>';
      } else {
        list += title;
      }
      list += '</a></li>\n';
    }
  }
  info["list"] = list;

  var sPlayer = sm2BarUITemplates["player"];
  var s = "";
  s += subKeys(sPlayer, info);
  if ( autoInstall ) {
    s += sm2BarUITemplates["installation-code"];
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
  //if ( !document.getElementById("inp-auto-install").checked )
  src += sm2BarUITemplates["header"];
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
  var obj = document.getElementById("preview-iframe");
  obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
  //setInterval(resizeIframe, 5000); // readjust height every 5s
}

window.onload = function() {
  writeCode();

  // allow the preview iframe to dyanmically adjust its height
  //  https://stackoverflow.com/questions/9975810/make-iframe-automatically-adjust-height-according-to-the-contents-without-using
  var obj = document.getElementById("preview-iframe");
  obj.onload = resizeIframe;

  //document.getElementById("header-code").value = sm2BarUITemplates["header"];
};

