"use strict";

var SpUtils = (function(){

  //function camelToKebab(s) {
  //  return s.replace(/((?<=[a-z\d])[A-Z]|(?<=[A-Z\d])[A-Z](?=[a-z]))/g, '-$1').toLowerCase();
  //}

  //function kebabToCamel(s) {
  //  // cf. https://stackoverflow.com/a/60738940
  //  return s.replace(/-./g, function(x){ return x[1].toUpperCase(); });
  //}

  // convert a string of "hh:mm:ss" to seconds
  function parseTime(t, def)
  {
    if ( t === null || t === "" ) {
      return def;
    }
    var a = t.split(":"), j, x = 0;
    for ( j = 0; j < a.length; j++ ) {
      x = x*60 + parseFloat(a[j]);
    }
    return x;
  }

  // convert seconds to "hh:mm:ss"
  function formatTime(t)
  {
    var m = Math.floor(t/60),
        s = Math.floor(t%60);
    var h = Math.floor(m/60);
    if (h > 0) {
      m = Math.floor(m%60);
    }
    var mm = (m < 10 ? "0" : "") + m;
    var ss = (s < 10 ? "0" : "") + s;
    var mm_ss = mm + ":" + ss;
    if (h > 0) {
      return "" + h + ":" + mm_ss;
    } else {
      return mm_ss;
    }
  }

  function removeClass(o, cls)
  {
    o.className = o.className.replace(new RegExp("\\s*"+cls+"\\s*", "g"), "");
  }

  function getOffsetX(o) // adapted from bar-ui.js
  {
    var left = 0;
    if (o.offsetParent) {
      for (; o.offsetParent; o=o.offsetParent) {
        left += o.offsetLeft;
      }
    } else if (o.x) {
      left += o.x;
    }
    return left;
  }

  function getClientX(e) // cf. bar-ui.js
  {
    return e.clientX || (e.touches && e.touches[0] && e.touches[0].pageX);
  }

  // save the input data attributes of element `el` to an object `config`
  // the possible attributes are given by `specs`
  // return the `object`
  function getDataAttribsFromElement(el, specs)
  {
    var key, val, spec, config = {};

    for (key in specs) {
      if (specs.hasOwnProperty(key)) {
        spec = specs[key];
        if (key in el.dataset) {
          val = el.dataset[key];
        } else {
          val = spec.defValue;
        }

        // convert values to proper data type
        if (spec.dataType === "choice") {
          if (spec.choices.indexOf(val)  < 0) {
            console.log("Error: key", key, "doesn't have a predefined value", val);
            val = spec.defValue;
          }
        } else if (spec.dataType === "time") {
          val = parseTime(val, parseTime(spec.defValue));
        } else if (spec.dataType === "bool") {
          if (val == "true" || val == "1") {
            val = true;
          } else {
            val = false;
          }
        }

        config[key] = val;
      }
    }

    if ( config.startTime !== undefined
      && config.endTime !== undefined
      && config.startTime < config.endTime ) {
      config.duration = config.endTime - config.startTime;
    } else {
      config.duration = 0;
    }

    return config;
  }

  // create a `tag` element with attributes given by `attribs`
  // attach the newly-created element to the parent node `par` (if given)
  function createElement(tag, attribs, par)
  {
    var el = document.createElement(tag), key;
    for (key in attribs) {
      if ( attribs.hasOwnProperty(key) ) {
        el[key] = attribs[key];
      }
    }
    if (par) {
      par.appendChild(el);
    }
    return el;
  }

  function decomposeColor(color)
  {
    var r = parseInt(color.slice(1, 3), 16),
        g = parseInt(color.slice(3, 5), 16),
        b = parseInt(color.slice(5, 7), 16);
    //console.log(r, g, b);
    return [r, g, b];
  }

  function darken(color, frac, alpha)
  {
    var c = decomposeColor(color),
        cref = 0;
    c[0] = Math.floor(c[0]*(1-frac) + cref*frac);
    c[1] = Math.floor(c[1]*(1-frac) + cref*frac);
    c[2] = Math.floor(c[2]*(1-frac) + cref*frac);
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ', ' + alpha + ')';
  }

  function lighten(color, frac, alpha)
  {
    var c = decomposeColor(color),
        cref = 255;
    c[0] = Math.floor(c[0]*(1-frac) + cref*frac);
    c[1] = Math.floor(c[1]*(1-frac) + cref*frac);
    c[2] = Math.floor(c[2]*(1-frac) + cref*frac);
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ', ' + alpha + ')';
  }

  function makePlayPauseSvg()
  {
    var s = ''
      + '<svg class="play" height="100%" viewBox="0 0 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.873 11.859l-10.701-6.63c-0.78-0.511-1.418-0.134-1.418 0.838v12.87c0 0.971 0.639 1.348 1.418 0.836l10.702-6.63c0 0 0.38-0.268 0.38-0.643-0.001-0.374-0.381-0.641-0.381-0.641z"/></svg>'
      + '<svg class="pause" height="100%" viewBox="0 0 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16.875 3.75c-1.243 0-2.25 0.382-2.25 1.625v14.25c0 1.243 1.007 1.625 2.25 1.625s2.25-0.382 2.25-1.625v-14.25c0-1.243-1.007-1.625-2.25-1.625zM8.125 3.75c-1.243 0-2.25 0.382-2.25 1.625v14.25c0 1.243 1.007 1.625 2.25 1.625s2.25-0.382 2.25-1.625v-14.25c0-1.243-1.007-1.625-2.25-1.625z"/></svg>'
      + '';
    return s;
  }

  return {
    parseTime: parseTime,
    formatTime: formatTime,
    removeClass: removeClass,
    getOffsetX: getOffsetX,
    getClientX: getClientX,
    getDataAttribsFromElement: getDataAttribsFromElement,
    createElement: createElement,
    darken: darken,
    lighten: lighten,
    makePlayPauseSvg: makePlayPauseSvg,
  };
})();



var SpSingle = (function(){

  var attribSpec = {
    // to match those in Spgen.uiTabs defined in spgen.js
    mediaType:           {dataType: "choice", choices: ["audio", "video"], defValue: "audio"},
    src:                 {dataType: "string"},
    poster:              {dataType: "string"},
    startTime:           {dataType: "time",   defValue: "00:00:00"},
    endTime:             {dataType: "time",   defValue: "00:00:00"},
    theme:               {dataType: "string", defValue: "default"},
    foregroundColor:     {dataType: "string"},
    backgroundColor:     {dataType: "string"},
    title:               {},
    wrapperStyle:        {},
    containerStyle:      {},
    mediaContainerStyle: {},
    toolbarStyle:        {},
    toolbarMainRowStyle: {},
    toolbarSubRowStyle:  {},
    playButtonStyle:     {},
    titleStyle:          {},
  };

  function buildControlsToolbar(ctl, config)
  {
    ctl.toolbar = SpUtils.createElement("div",
        {
          className: "sp-toolbar",
          style: config.toolbarStyle,
        },
        ctl.container);

    ctl.mainRow = SpUtils.createElement("div",
        {
          className: "sp-toolbar-main-row",
          style: config.toolbarMainRowStyle,
        },
        ctl.toolbar);

    ctl.subRow = SpUtils.createElement("div",
        {
          className: "sp-toolbar-sub-row",
          style: config.toolbarSubRowStyle,
        },
        ctl.toolbar);

    // main row
    ctl.playButton = SpUtils.createElement("div",
        {
          className: "sp-play-button",
          style: config.playButtonStyle,
          innerHTML: SpUtils.makePlayPauseSvg(),
        },
        ctl.mainRow);

    ctl.title = SpUtils.createElement("div",
        {
          className: "sp-title",
          style: config.titleStyle,
          innerHTML: config.title,
        },
        ctl.mainRow);

    // turn a long title to a marquee
    // TODO: not working
    if ( ctl.title.scrollWidth > ctl.title.offsetWidth
        && !ctl.title.querySelector("marquee") ) {
      ctl.title.innerHTML = "";
      ctl.titleMarquee = SpUtils.createElement("marquee",
          {
            innerHTML: config.title,
          },
          ctl.title);
    }

    // sub row
    ctl.timeBar = SpUtils.createElement("div",
        {
          className: "sp-time-bar",
        },
        ctl.subRow);

    ctl.curTime = SpUtils.createElement("div",
        {
          className: "sp-cur-time",
          innerHTML: "00:00",
        },
        ctl.timeBar);

    ctl.progressCell = SpUtils.createElement("div",
        {
          className: "sp-progress-cell",
        },
        ctl.timeBar);

    ctl.progress = SpUtils.createElement("div",
        {
          className: "sp-progress",
        },
        ctl.progressCell);

    ctl.played = SpUtils.createElement("div",
        {
          className: "sp-played",
        },
        ctl.progress);

    var seekerStyle = "";
    if (config.foregroundColor) {
      seekerStyle = "background-color:" + config.foregroundColor;
    }
    ctl.seeker = SpUtils.createElement("div",
        {
          className: "sp-seeker",
          style: seekerStyle,
        },
        ctl.progress);

    ctl.maxTime = SpUtils.createElement("div",
        {
          className: "sp-max-time",
          innerHTML: "0:00",
        },
        ctl.timeBar);

  }

  function applyForegroundColor(config)
  {
    var fgStyle = "";
    if (config.foregroundColor === undefined) {
      return;
    }
    fgStyle = "color:" + config.foregroundColor + ";"

    config.toolbarStyle = fgStyle + config.toolbarStyle;
  }

  function applyBackgroundColor(config)
  {
    var bgStyle = "";
    if (config.backgroundColor === undefined) {
      return;
    }
    bgStyle = "background-color:" + config.backgroundColor + ";"

    if (config.theme === "dark") { // dark theme
      bgStyle += "background-image: "
        + "linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, "
        + "rgba(255, 255, 255, 0.45) 2%, "
        + "rgba(255, 255, 255, 0.38) 6%, "
        + "rgba(255, 255, 255, 0.36) 50%, "
        + "rgba(255, 255, 255, 0.25) 96%, "
        + "rgba(255, 255, 255, 0.3) 98%, "
        + "rgba(255, 255, 255, 0.2) 100%);";
      bgStyle += "border-color:" + SpUtils.darken(config.backgroundColor, 0.3, 0.5) + ";";
      bgStyle += "border-top-color:" + SpUtils.lighten(config.backgroundColor, 0.3, 0.3) + ";";
      bgStyle += "box-shadow: 1px 1px 1px " + SpUtils.darken(config.backgroundColor, 0.5, 0.7) + ";";
    } else { // light theme
      bgStyle += "background-image: "
        + "linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, "
        + "rgba(255, 255, 255, 0.4) 2%, "
        + "rgba(255, 255, 255, 0.5) 5%, "
        + "rgba(255, 255, 255, 0.8) 50%, "
        + "rgba(255, 255, 255, 0.2) 96%, "
        + "rgba(255, 255, 255, 0.3) 98%, "
        + "rgba(255, 255, 255, 0.2) 100%);";
      bgStyle += "border-color:" + SpUtils.darken(config.backgroundColor, 0.3, 0.1) + ";";
      bgStyle += "border-top-color:" + SpUtils.lighten(config.backgroundColor, 0.5, 0.5) + ";";
      bgStyle += "box-shadow: 1px 1px 1px " + SpUtils.darken(config.backgroundColor, 0.3, 0.3) + ";";
    }
    config.containerStyle = bgStyle + config.containerStyle;
  }

  function translateHighLevelAttribs(el, config)
  {
    applyForegroundColor(config);
    applyBackgroundColor(config);
  }

  function buildUserInterface(el, config)
  {
    var ctl = {el: el};

    // wrapper: outer container
    ctl.wrapper = SpUtils.createElement("div",
        {
          className: "sp-wrapper",
          style: config.wrapperStyle,
        },
        el);

    // container: inner container
    var containerClassList = ["sp-container"];
    if (config.theme === "dark") {
      containerClassList.push("sp-dark");
    }
    ctl.container = SpUtils.createElement("div",
        {
          className: containerClassList.join(" "),
          style: config.containerStyle,
        },
        ctl.wrapper);

    // create a media container
    ctl.mediaContainer = SpUtils.createElement("div",
        {
          className: "sp-media",
          style: config.mediaContainerStyle,
        },
        ctl.container);

    if ( config.mediaType === "audio" ) {
      ctl.media = SpUtils.createElement("audio",
          {
            src: config.src,
          },
          ctl.mediaContainer);
    } else if ( config.mediaType === "video" ) {
      ctl.media = SpUtils.createElement("video",
          {
            src: config.src,
            poster: config.poster,

            loop: "loop",
          },
          ctl.mediaContainer);
    }

    buildControlsToolbar(ctl, config);

    return ctl;
  }

  function registerEvents(ctl, config, state)
  {
    var seekFunc = function(e) {
      if ( config.endTime <= config.startTime ) {
        return;
      }
      e.stopPropagation();
      ctl.media.currentTime = config.startTime
        + (SpUtils.getClientX(e) - SpUtils.getOffsetX(ctl.progress))
           * config.duration / ctl.progress.clientWidth;
    };

    ctl.progress.addEventListener("mouseup",
        function(e){
          if ( state.inited ) {
            seekFunc(e);
          }
        });

    ctl.progress.addEventListener("touchend",
        function(e){
          if ( state.inited ) {
            seekFunc(e);
          }
        });

    ctl.media.addEventListener("loadedmetadata",
        function(){
          if ( config.endTime <= config.startTime ) {
            config.endTime = ctl.media.duration;
          }
          config.duration = config.endTime - config.startTime;
          ctl.maxTime.innerHTML = SpUtils.formatTime(config.duration);
        });

    var togglePlayPauseButton = function(btn, paused) {
      if (paused) {
        btn.querySelector("svg.play").style.display = "inline";
        btn.querySelector("svg.pause").style.display = "none";
      } else {
        btn.querySelector("svg.play").style.display = "none";
        btn.querySelector("svg.pause").style.display = "inline";
      }
    };

    ctl.playButton.addEventListener("click",
        function(){
          if ( !state.inited ) {
            state.inited = true;
            ctl.media.currentTime = config.startTime;
            // for Wechat on iPhone/iPad, setting media.currentTime has no effect
            // until the media's "canplay" event is triggered
            ctl.media.addEventListener("canplay",
              function(){
                // Note: setting currentTime may tigger another "canplay" event
                // creating an infinite loop, which we have to prevent
                if (ctl.media.currentTime < config.startTime) {
                  ctl.media.currentTime = config.startTime;
                }
              });
          }

          //console.log(this.innerHTML, this.querySelector("svg.play"), this.querySelector(".pause"));
          if ( ctl.media.paused ) {
            ctl.media.play();
          } else {
            ctl.media.pause();
          }
          togglePlayPauseButton(this, ctl.media.paused);
        });
    togglePlayPauseButton(ctl.playButton, true);

    ctl.media.addEventListener("timeupdate",
        function(){
          var t = Math.max( Math.min(ctl.media.currentTime, config.endTime) - config.startTime, 0 );
          // display the updated current time
          ctl.curTime.innerHTML = SpUtils.formatTime(t);
          // update the progress
          var availWidth = ctl.progress.clientWidth - ctl.seeker.clientWidth,
              adjWidth = Math.floor(availWidth*t/config.duration);
          ctl.seeker.style.left = adjWidth + "px";
          ctl.played.width = (adjWidth + ctl.seeker.clientWidth/2) + "px";

          if ( ctl.media.currentTime >= config.endTime ) {
            ctl.media.pause();
            togglePlayPauseButton(ctl.playButton, true);
            state.inited = false; // reset the player, as if the play button is never clicked
          }
        });
  }

  // initialize a single player
  function init(el)
  {
    // skip an element that has been initialized
    if ( el.dataset.inited ) {
      return 0;
    }
    el.dataset.inited = true;

    // load the data-attributes into config
    var config = SpUtils.getDataAttribsFromElement(el, attribSpec);

    // translate high-level attributes such as data-background-color
    // to lower-level ones for building the user interface
    translateHighLevelAttribs(el, config);

    // create interface, return a set of controls
    var ctl = buildUserInterface(el, config);

    // player's internal states
    var state = {
      inited: false,
    };

    // register events
    registerEvents(ctl, config, state);
    return 1;
  }

  function initAll() {
    var singles = document.getElementsByClassName("sp-single"), j, count = 0;
    for (j = 0; j < singles.length; j++) {
      // init() will skip instances that have been already initialized
      count += init(singles[j]);
    }
    if (count > 0) console.log("initialized", count, "players");
  }

  // initialize all instances
  // We need to do this regularly .
  // This JavaScript file `splayer.js` may be loaded immediately after seeing the first DOM instance
  // and is skipped when later instances are created and seen:w
  // so the selector ".sp-single" in initAll() may give a growing list if we check at a later time
  // initAll() is able to handle repeated calling without repeatedly initializing already initialized instances
  setInterval(function() { initAll(); }, 2000);

  return {
    initAll: initAll,
  };
})();


