"use strict";

var mediacomVersion = "V0.39";

(function(){

  var defMedia = {
    "audioSrc": "https://i3.vzan.cc/upload/audio/mp3/20200614/d1c2588412784fa7a2baf8b73242c99a.mp3", // water-moon-zen-heart, 17s
    "videoSrc": "https://i3.vzan.cc/upload/video/mp4/20200614/82a09afb5f0548c7a0de4d8d1fd36a65.mp4", // fyfy 4
    "videoPoster": "https://i2.vzan.cc/upload/image/jpg/20200614/77e2f7393bde43238cf3304338446ce5.jpg", // fyfy 4
    "imageSrc": "https://i2.vzan.cc/upload/image/jpg/20201115/c7c3456d7c614678bd2ab3303bf0b095.jpg",
    "qrcodeSrc": "https://i2.vzan.cc/upload/image/png/20201115/794097fad23246db9e5cf312ea292336.png",
  };

  // TODO: better site customization
  if (/xljt\.cloud/.exec(location.href)) {
    defMedia = {
      "audioSrc": "https://i3.vzan.cc/upload/audio/mp3/20200220/e27968fdbc6b411a831ac9b7bfc56588.mp3",
               // "http://i3.vzan.cc/mp3/20190925/2cc455b03b164f40858eca52a6ef8d9d/v.f1010.mp3"
      "videoSrc": "http://baidu.xljt.cloud/xlfm/video/14.zhenhanshipin/3.mp4",
      "videoPoster": "http://baidu.xljt.cloud/xlfm/video/14.zhenhanshipin/3.jpg",
      "imageSrc": "https://i2.vzan.cc/image/liveimg/png/20190609/2299c4114637468387f6fb09e91113a4.png",
      "qrcodeSrc": "http://baidu.xljt.cloud/extra/app/img/fofabook-qrcode.png",
    };
  }

  var defVars = {
    stdBlockBottomHtml: "<p>&nbsp;</p>",
  };

  var _styles = {
    "default": {
      "styleOptions": {
        "default": { // yellow title theme
          "name": "默认方案",
          //"backgroundColor": "#fff7e7",
          "backgroundColor": "#fcefdc",
          "borderColor": "#f3b83e",
          "borderWidth": "7px 0 7px 0",
          "titleBackgroundColor": "#fce988",
          "titleColor": "#000",
          //"titleColor": "#420",
          "titleFontWeight": "bold",
        },
        "1": { // blog compatible
          "name": "配色方案1",
          "backgroundColor": "#fcefdc",
          "borderColor": "#eca34a",
          "borderWidth": "7px 0 7px 0",
          "titleBackgroundColor": "#fce988",
          "titleColor": "#000",
          //"titleBackgroundColor": "#b21",
          //"titleColor": "#fff",
          "titleFontWeight": "bold",
        },
        "2": { // old orange theme
          "name": "配色方案2",
          "backgroundColor": "#ffe991",
          "borderColor": "#f3b83e",
          "borderWidth": "7px 0 7px 0",
          "titleBackgroundColor": "#ffbb99",
          "titleColor": "#000",
          //"titleBackgroundColor": "#b21",
          //"titleColor": "#fff",
          "titleFontWeight": "bold",
        },
      },
      "container": {
        "begin": '<div style="border:solid {styleOptions.borderColor};'
                 + 'border-width:{styleOptions.borderWidth};'
                 + 'background-color:{styleOptions.backgroundColor}">',
        "end": '</div>',
      },
      "title": '<div style="padding:2px;border:1px solid {styleOptions.titleBackgroundColor};'
             + 'border-radius:5px;margin:2em auto 0.5em auto;width:800px;max-width:95%">'
             + '<div style="padding:0.5em 1em;border-radius:5px;'
             + 'background-color:{styleOptions.titleBackgroundColor};color:{styleOptions.titleColor};'
             + 'font-size:16px;font-weight:{styleOptions.titleFontWeight};text-align:center">'
             + '{title}'
             + '</div>'
             + '</div>',
      //"noTitle": '<div style="margin-top:2em;line-height:0">&nbsp; &nbsp;</div>',
      "descr": '<p style="color:#400;background-color:rgba(255,255,255,0.6);box-shadow:1px 1px 1px rgba(240,150,150,0.2);font-size:14px;margin:20px 5%;padding:0.5em 1em;line-height:1.8;border-radius:4px;">{descr}</p>',
      "pageStyle": {
        "background": "#fcefdc",
        "padding-top": "30px",
      },
    },

    "simple": {
      "container": {
        "begin": "",
        "end": "",
      },
      "title": '<div style="color:#222;font-size:20px;font-weight:bold;margin:25px auto 5px auto;text-align:center;padding:0 5%">'
             + '{title}'
             + '</div>',
      //"noTitle": '<div style="margin-top:25px;line-height:0">&nbsp; &nbsp;</div>',
      "descr": '<p style="color:#222;font-size:16px;margin:20px 5%;line-height:1.5;letter-spacing:0.05em">{descr}</p>',
      "pageStyle": {
        "background": 'background-color:#fff',
      },
    },

    "darkred": {
      "container": {
        "begin": "",
        "end": "",
      },
      "title": '<div style="padding:2px;border:1px solid #b21;border-radius:5px;margin:1.2em auto 0em auto;width:760px;max-width:80%">'
             + '<div style="padding:0.5em 1em;border-radius:5px;background-color:#b21;color:#fff;font-size:16px;font-weight:bold;text-align:center;letter-spacing:0.1em">'
             + '{title}'
             + '</div>'
             + '</div>',
      "descr": '<p style="color:#400;background-color:rgba(255,255,255,0.6);box-shadow:1px 1px 1px rgba(240,150,150,0.2);font-size:14px;margin:20px 5%;padding:0.5em 1em;line-height:1.8;border-radius:4px;">{descr}</p>',
      "pageStyle": {
        "background": 'background-color:#fff',
      },
    // disabling gradient b/c margin issue
    //'background-image:linear-gradient(160deg,rgba(255,200,200,0.3) 0%,rgba(255,255,250,1.0) 25% 45%,rgba(255,200,200,0.5) 70%,rgba(255,255,235,0.8) 85%,rgba(255,200,200,0.5) 100%)',
    },

    "pink": {
      "container": {
        "begin": "",
        "end": "",
      },
      "title": '<section style="padding:25px 0px 5px 0px">'
             + '<div style="margin:0px 5% 0px 5%;padding:15px 2em;border-radius:3px;color:#fff;background-color:rgb(240,120,140);box-shadow:0.1em 0.1em 0.2em #caa;line-height:1.2;font-size:16px;font-weight:bold;text-shadow:1px 1px 5px rgba(80,0,0,0.3);text-align:center;">'
             + '{title}'
             + '</div>'
             + '</section>',
      "descr": '<p style="margin:20px 5%;padding:15px;border-radius:3px;color:#600;background-color:rgba(255,250,253,0.8);box-shadow:0.1em 0.1em 0.2em rgba(240,180,180,0.5);line-height:1.5;font-size:16px;">{descr}</p>',
      "pageStyle": {
        "background": 'background-image:radial-gradient(circle,rgba(255,150,150,0.3) 0%,rgba(255,245,245,0.3) 70%,rgba(255,255,255,0.5) 80%,rgba(255,220,200,0.3) 100%)',
      },
    },

    "orange": {
      "container": {
        "begin": "",
        "end": "",
      },
      "title": '<section style="padding:30px 0px 10px 0px">'
             + '<div style="width:96%;margin:auto;max-width:800px;padding:10px 5px;color:rgb(128,80,4);background-image:linear-gradient(to bottom,rgb(245,230,164),rgb(240,152,23));text-shadow:3px 4px 5px rgb(255,235,148);border:1px solid rgb(238,220,110);line-height:1.7;font-size:18px;font-weight:bold;text-align:center;">'
             + '{title}'
             + '</div>'
             + '</section>',
      "descr": '<p style="color:rgb(113,33,33);background-color:rgb(251,241,214);font-size:18px;line-height:1.5;margin:20px 2%;padding:10px">{descr}</p>',
      "pageStyle": {
        "background": 'background-color:rgb(251,241,214)',
      },
    },

    "golden": {
      "container": {
        "begin": "",
        "end": "",
      },
      "title": '<section style="margin:0px;">'
             + '<section style="background:linear-gradient(120deg, rgba(255,240,0,0.1) 0%, rgba(255,240,0,0.8) 20% 50%, rgba(255,240,0,0.6) 70%, transparent 100%);padding:0px 30px 40px 0px;width:100%;min-width:200px;">'
             + '<section style="color:#fff;font-size:18px;text-shadow:1px 1px 5px rgba(120,60,0,0.3);background:radial-gradient(circle at 10% 20%, rgba(255,255,255,0.2) 0%,rgba(255,150,0,1.0) 20%,rgba(255,150,0,1.0) 80%, rgba(255,180,0,0.9) 100%);box-shadow:0px 0px 1px rgba(255,255,255,0.3),0px 0px 3px rgba(200,200,150,0.7);border-radius:0px 0px 40px 0px;padding:40px 1em 50px 1em;line-height:1.5;letter-spacing:0.05em;font-weight:bold;text-align:center;">'
             + '{title}'
             + '</section>'
             + '</section>'
             + '</section>',
      "descr": '<p style="background:linear-gradient(150deg, rgba(255,253,240,0.9) 0%, rgba(255,250,230,0.8) 100%);color:#630;padding:1em;font-size:16px;letter-spacing:0.07em;line-height:1.6;margin:20px 3%;border:1px solid rgba(255,220,0,0.7);border-width:1px 0px 0px 20px;border-radius:0px 0px 10px 0px;box-shadow:3px 3px 3px rgba(200,200,50,0.3);">{descr}</p>',
      "pageStyle": {
        "background": 'background-image:radial-gradient(circle at 80% 20%,rgba(255,255,240,0.8) 0%,rgba(0,0,0,0) 30%), radial-gradient(circle at 20% 80%,rgba(255,255,240,0.8) 0%,rgba(0,0,0,0) 40%), linear-gradient(to top left,rgba(0,0,0,0) 40%,rgba(255,255,240,0.7) 50%,rgba(0,0,0,0) 60%); background-color:rgba(255,240,0,1.0)',
      },
    },

    "red": {
      "container": {
        "begin": "",
        "end": "",
      },
      "title": '<section style="margin:0px;padding:30px 0px 10px 0px">'
             + '<div style="background-color:rgb(200,50,30);background:linear-gradient(90deg,rgb(200,50,30) 0%,rgb(240,10,10) 40% 70%,rgb(200,50,30) 100%);box-shadow:1px 1px 3px rgba(200,50,30,0);text-align:center;padding:0px 20px;line-height:1.8;position:relative;margin:auto;width:800px;max-width:100%;">'
             + '<span style="display:block;font-size:16px;font-weight:bold;color:#fff;text-shadow:1px 1px 4px rgba(0,0,0,0.3);background-color:rgba(255,200,255,0.15);padding:0.8em 2em;letter-spacing:0.05em;">'
             + '{title}'
             + '</span>'
             + '</div>'
             + '</section>',
      "descr": '<p style="color:#622;text-shadow:0px 0px 1px rgba(255,255,255,0.5);letter-spacing:0.08em;background-image:linear-gradient(90deg,rgba(255,250,230,0.9) 0%,rgba(255,255,255,0.7) 40% 70%,rgba(255,250,230,0.9) 100%);border-left:10px solid rgba(255,0,0,0.5);font-size:16px;padding:0.8em 1.6em;line-height:1.5;border-radius:1px;margin:40px 5%;position:relative;">{descr}</p>',
      "pageStyle": {
        "background": 'background:radial-gradient(circle, rgba(255,240,230,0.5) 0%,rgba(255,255,240,1.0) 60%,rgba(255,200,100,0.2) 80%,rgba(255,140,100,0.1) 100%)',
      },
    },

    "blue": {
      "container": {
        "begin": "",
        "end": "",
      },
      "title": '<div style="width:92%;margin:auto;max-width:760px;margin-bottom:0.7em;padding:0.8em 10% 0.8em 10%;border-radius:0px 0px 5px 5px;color:#fff;background:linear-gradient(150deg,rgba(20,70,120,0.9) 0%,rgba(50,120,250,0.9) 20% 70%,rgba(20,90,150,0.9) 100%);box-shadow:0.2em 0.05em 0.3em #79c;line-height:1.6;font-size:16px;font-weight:700;letter-spacing:0.1em;text-shadow:0px -1px 1px rgba(0,0,100,0.3);text-align:center;">'
             + '{title}'
             + '</div>',
      "descr": '<p style="width:90%;margin:auto;max-width:800px;font-size:16px;color:rgb(0,20,50);margin-top:50px;margin-bottom:50px;line-height:1.5;padding:30px 30px;position:relative"><span style="display:inline-block;position:absolute;top:10px;left:0px;width:30px;height:1px;background-color:rgb(100,150,255)"></span><span style="display:inline-block;position:absolute;top:0px;left:10px;width:1px;height:30px;background-color:rgb(100,150,255)"></span>{descr}<span style="display:inline-block;position:absolute;bottom:10px;right:0px;width:30px;height:1px;background-color:rgb(100,150,255)"></span><span style="display:inline-block;position:absolute;bottom:0px;right:10px;width:1px;height:30px;background-color:rgb(100,150,255)"></span></p>',
      "pageStyle": {
        "background": 'background:linear-gradient(-20deg,rgba(220,240,255,0.3) 0%,rgba(255,255,255,1.0) 80%,rgba(220,240,255,0.3) 100%);',
      },
    },

    "": {
      "container": {
        "begin": "",
        "end": "",
      },
      "title": "",
      "descr": "",
      "pageStyle": {
        "background": "",
      },
    },
  };

  var audioId = 0;
  var videoId = 0;
  var imageId = 0;

  var templates = {
    "audio": '\n<!-- 音频{audioId}源代码开始 -->\n'
      + '{containerBeginHtml}'
      + '{titleHtml}'
      + '<div style="padding:30px 1% 30px 1%;text-align:center">'
      + '<audio src="{src}" {attrs}controls="controls"'
      + ' style="width:800px;max-width:100%"></audio>'
      + '</div>'
      + '{descrHtml}'
      + '{containerEndHtml}\n'
      + '<!-- 音频{audioId}源代码结束 -->\n'
      + '{blockBottomHtml}\n',

    "video": '\n<!-- 视频{videoId}源代码开始 -->\n'
      + '{containerBeginHtml}'
      + '{titleHtml}'
      + '<div style="padding:20px 2% 20px 2%;text-align:center">'
      + '<video src="{src}" poster="{poster}" {attrs}preload="none" controls="controls" webkit-playsinline="" playsinline=""'
      + ' style="background-color:black;width:800px;max-width:100%;"></video>'
      + '</div>'
      + '{descrHtml}'
      + '{containerEndHtml}\n'
      + '<!-- 视频{videoId}源代码结束 -->\n'
      + '{blockBottomHtml}\n',

    "image": '\n<!-- 图片{imageId}源代码开始 -->\n'
      + '{containerBeginHtml}'
      + '{titleHtml}'
      + '<div style="padding:20px 2% 20px 2%;text-align:center">'
      + '{linkBegin}'
      + '<img src="{src}" style="max-width:100%"/>'
      + '{linkEnd}'
      + '</div>'
      + '{descrHtml}'
      + '{containerEndHtml}\n'
      + '<!-- 图片{imageId}源代码结束 -->\n'
      + '{blockBottomHtml}\n',

    "": ''
  };

  var subKeys = function(template, tab, prefix) {
    var s = template;
    if (prefix === undefined) {
      prefix = "";
    }
    for ( var k in tab ) {
      if ( tab.hasOwnProperty(k) ) {
        var pat = "{" + prefix + k + "}";
        var re = new RegExp(pat, 'gi');
        s = s.replace(re, tab[k]);
      }
    }
    return s;
  };

  var getStyle = function(style) {
    if ( !_styles[style] ) {
      style = "default";
    }
    return Object.assign({}, _styles[style]);
  };

  var getStyleOptionsUiControls = function(style) {
    var styleInfo = getStyle(style);
    var styleOptions = styleInfo.styleOptions || {};
    var schemes = [];

    schemes.push({
      value: "default",
      text: "默认方案",
    });
    // loop over stock schemes of styleOptions
    for (var key in styleOptions) { // key: "default" or "1"
      if (styleOptions.hasOwnProperty(key) && key !== "default") {
        schemes.push({
          value: key,
          text: styleOptions[key].name || ("方案" + key),
        });
      }
    }

    var uiControls = [];
    var options = styleOptions["default"];
    if (options) {
      for (key in options) {
        if (options.hasOwnProperty(key) && key !== "name") {
          uiControls.push(key);
        }
      }
    }

    if (uiControls.length > 0) {
      schemes.push({
        value: "custom",
        text: "自定义…",
      });
    }

    return {
      schemes: schemes,
      uiControls: uiControls,
    };
  };

  var getStyleFromInfo = function(info) {
    var style = info.style || "default";
    if ( !_styles[style] ) {
      style = "default";
    }
    return _styles[style];
  };

  var getPageStyle = function(info) {
    var style = getStyleFromInfo(info);
    return style.pageStyle;
  };

  var renderTitle = function(titleTemplate, noTitleTemplate, info, styleOptions)
  {
    var s0 = info.title;
    if ( s0 === undefined ) {
      return (noTitleTemplate ? noTitleTemplate : "");
    }
    s0 = s0.replace(/^\s+|\s+$/g, "");
    if ( s0 === "" ) {
      return "";
    }
    var s = applyStyleOptions(titleTemplate, styleOptions);
    //console.log(s, styleOptions);
    s = subKeys(s, info);
    return s;
  };

  var renderDescr = function(descrTemplate, info)
  {
    var s0 = info.descr;
    if ( s0 === undefined ) {
      return "";
    }
    s0 = s0.replace(/^\s+|\s+$/g, "");
    if ( s0 === "" ) {
      return "";
    }
    // paragraph is separated by two new lines
    var x = s0.split("\n\n"), i, s = "";
    // render paragraph by paragraph
    for ( i = 0; i < x.length; i++ ) {
      info["descr"] = x[i];
      console.log(i, x[i], x.length, x[i].length, "s0", s0);
      var s1 = subKeys(descrTemplate, info);
      s += s1;
    }
    return s;
  };

  var renderImage = function(info, renderFunc)
  {
    if ( info.href !== undefined && info.href !== "" ) {
      var attrs = '';
      if ( info.openInNewPage ) {
        attrs = ' target="_blank" rel="noopener noreferrer"';
      }
      var styles = '';
      styles += ' style="display:inline-block;border:3px solid #8be"';
      info.linkBegin = '<a href="' + info.href + '"' + attrs + styles + '>';
      info.linkEnd = '</a>';
    } else {
      info.linkBegin = '';
      info.linkEnd = '';
    }

    if ( info.incId ) {
      info['imageId'] = ++imageId;
    } else {
      info['imageId'] = "";
    }

    var s = subKeys(templates["image"], info);
    if ( renderFunc ) {
      renderFunc(s);
    }
    return s;
  };

  var renderAudio = function(info, renderFunc)
  {
    var opts = info["opts"], attrs = '';

    if ( info.loop === undefined ) {
      if ( opts !== undefined && opts.indexOf("l") >= 0 ) {
        info.loop = true;
      } else {
        info.loop = false;
      }
    }
    if ( info.loop ) {
      attrs += 'loop="loop" ';
    }

    if ( info.autoplay === undefined ) {
      if ( opts !== undefined && opts.indexOf("a") >= 0 ) {
        info.autoplay = true;
      } else {
        info.autoplay = false;
      }
    }
    if ( info.autoplay ) {
      attrs += 'autoplay="autoplay" ';
    }

    info.attrs = attrs;

    if ( info.incId ) {
      info['audioId'] = ++audioId;
    } else {
      info['audioId'] = "";
    }

    var s = subKeys(templates["audio"], info);
    if ( renderFunc ) {
      renderFunc(s);
    }
    return s;
  };

  var renderVideo = function(info, renderFunc)
  {
    var opts = info["opts"] || "", attrs = '';

    if ( info.loop === undefined ) {
      if ( opts !== undefined && opts.indexOf("L") >= 0 ) {
        info.loop = false;
      } else {
        info.loop = true;
      }
    }
    if ( info.loop ) {
      attrs += 'loop="loop" ';
    }

    if ( info.autoplay === undefined ) {
      if ( opts !== undefined && opts.indexOf("a") >= 0 ) {
        info.autoplay = true;
      } else {
        info.autoplay = false;
      }
    }
    if ( info.autoplay ) {
      attrs += 'autoplay="autoplay" ';
    }

    info.attrs = attrs;

    if ( info.incId ) {
      info['videoId'] = ++videoId;
    } else {
      info['videoId'] = "";
    }

    if ( info.poster === undefined ) {
      info.poster = "";
    }
    var s = subKeys(templates["video"], info);
    if ( renderFunc ) {
      renderFunc(s);
    }
    return s;
  };

  var guessMediaType = function(info) {
    var type = info.type;
    var defType = "audio";

    if ( type !== undefined ) {
      return type;
    } else {
      // start guessing
      var src = info.src;
      var p = src.indexOf("?");
      if ( p >= 0 ) src = src.slice(0, p);
      if ( info.poster !== undefined ) {
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
  };

  var applyStyleOptions = function(template, styleOptions) {
    return subKeys(template, styleOptions, "styleOptions\.");
  };

  var removeBottomBorder = function(borderWidth) {
    if (borderWidth === undefined || borderWidth === "none") {
      return borderWidth;
    }
    var bwArray = borderWidth.split(" ");
    if (bwArray.length > 1) {
      bwArray = [bwArray[0], bwArray[1], "0", "0"];
    } else if (bwArray.length === 1) {
      bwArray = [bwArray[0], bwArray[0], "0", "0"];
    }
    return bwArray.join(" ");
  }

  var renderContainer = function(template, info, styleOptions) {
    var so = Object.assign({}, styleOptions);
    if (info.noBottomBorder) {
      so.borderWidth = removeBottomBorder(so.borderWidth);
    }
    return applyStyleOptions(template, so);
  };

  // render media according to info,
  // needs 'type', 'src', 'style', 'title', 'descr'
  // for type = 'video', requires 'poster', 'video'
  var render = function(info, renderFunc, errorf) {

    var style = getStyleFromInfo(info); // "default", "simple", "darkred", etc.
    var styleScheme = info.styleScheme || "default"; // "default", "1", "2"

    // copy style options
    var styleOptions = {};
    if (style.styleOptions) {
      if (style.styleOptions.hasOwnProperty(styleScheme)) {
        Object.assign(styleOptions, style.styleOptions[styleScheme]);
      }
    }
    if (styleScheme === "custom" && info.styleOptions) {
      // use the user input style options to override the default one
      Object.assign(styleOptions, info.styleOptions);
    }
    //console.log(styleOptions);

    info.containerBeginHtml = renderContainer(style.container.begin, info, styleOptions);
    info.containerEndHtml = renderContainer(style.container.end, info, styleOptions);
    info.titleHtml = renderTitle(style.title, style.noTitle, info, styleOptions);
    info.descrHtml = renderDescr(style.descr, info);
    info.blockBottomHtml = info.noBottomSpace ? "" : defVars.stdBlockBottomHtml;

    var s = "";
    var type = guessMediaType(info);
    if ( type === "audio" ) {
      s += renderAudio(info, renderFunc);
    } else if ( type === "video" ) {
      s += renderVideo(info, renderFunc);
    } else if ( type === "image" ) {
      s += renderImage(info, renderFunc);
    } else if ( errorf ) {
      errorf();
    }
    return s;
  };

  window.MediaCom = {
    defMedia: defMedia,
    render: render,
    getStyle: getStyle,
    getStyleOptionsUiControls: getStyleOptionsUiControls,
    getPageStyle: getPageStyle,
  };
})();
