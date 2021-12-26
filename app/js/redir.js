"use strict";

;(function() {

  function isWeixin()
  {
    return !!navigator.userAgent.match(/MicroMessenger/i);
  }

  /**
   * Encode a string by
   *
   * 1. flipping the order
   * 2. swapping letters defined in `swapLetters`
   *
   * Calling this function twice gives back the original.
   *  */ 
  function flippingEncode(s)
  {
    var i, n = s.length, t = "", c, p;
    var swapLetters = "%/:?&=.monhtpqjJZz-_";
    for ( i = 0; i < n; i++ ) {
      var c = s.charAt(i);
      var p = swapLetters.indexOf(c);
      if ( p >= 0 ) {
        c = swapLetters.charAt(swapLetters.length - 1 - p);
      }
      t = c + t;
    }
    return t;
  }

  function initUiElements(params)
  {
    function setUiElement(id, attr, val) {
      var el = document.getElementById(id);
      if (el) {
        el[attr] = val;
      }
    }

    setUiElement("mode", "value", params.mode);
    setUiElement("enc", "value", params.enc);
    setUiElement("title", "innerHTML", params.title);
    setUiElement("mobile", "value", params.mobile);
    setUiElement("dmap", "value", params.dmap);
    if (params.showAdvancedOptions) {
      document.getElementById("advanced-options").style.display = "";
    }
  }

  function getActionFromMode(mode)
  {
    var action = null;

    if ( mode === "0" ) { // prompt for redirection if in wechat
      action = isWeixin() ? "prompt-redir" : "go";
    } else if ( mode === "1" ) { // always prompt for redirection
      action = "prompt-redir";
    } else if ( mode === "2" ) { // embed webpage if in wechat
      action = isWeixin() ? "embed" : "go";
    } else if ( mode === "3" ) {
      action = "embed";
    } else if ( mode === "go" ) {
      action = "go";
    }

    return action;
  }

  function parseUrlParams()
  {
    var defParams = {
      url: null,
      mode: "2",
      enc: "0",
      mobile: "",
      dmap: "1",
      title: "",
      wxRedirect: "",
      showAdvancedOptions: false,
    };
    var params = Object.assign({}, defParams);
    var p, q, args, i, kv;

    var href = location.href; // address bar
    q = href.indexOf("?"); // look for "?"
    if ( q >= 0 ) {
      var s = href.slice(q+1); // get the arguments

      // look for URL in the address bar
      p = s.indexOf("url="); // look for "url="
      if ( p >= 0 ) {
        args = s.slice(0,p);
        params.url = s.slice(p+4); // everything after "url="
      } else {
        args = s;
      }

      args = args.split("&");
      for ( i = 0; i < args.length; i++ ) {
        kv = args[i].split("=");

        if ( kv[0] === "mode" ) {

          if ( kv[1] !== undefined && kv[1] !== "" ) {
            params.mode = kv[1];
          } else {
            params.mode = defParams.mode;
          }

        } else if ( kv[0] === "enc" ) {

          if ( kv[1] !== undefined && kv[1] !== "" ) {
            params.enc = kv[1];
          } else {
            params.enc = "1"; // this is the default when parameter "enc" exists
          }

        } if ( kv[0] === "title" ) {

          if ( kv[1] !== undefined && kv[1] !== "" ) {
            params.title = URIB64.decode(kv[1]);
          } else {
            params.title = defParams.title;
          }

        } else if ( kv[0] === "mobile" ) {

          if ( kv[1] !== undefined && kv[1] !== "" ) {
            params.mobile = kv[1];
          } else {
            params.mobile = "1"; // this is the default when parameter "mobile" exists
          }

        } else if ( kv[0] === "dmap" ) {

          if ( kv[1] !== undefined && kv[1] !== "" ) {
            params.dmap = kv[1];
          } else {
            params.dmap = "1"; // this is the default when parameter "dmap" exists
          }

        } else if ( kv[0] === "wx_redirect" ) {

          if ( kv[1] !== undefined && kv[1] !== "" ) {
            params.wxRedirect = kv[1];
          } else {
            params.wxRedirect = defParams.wxRedirect;
          }

        } else if ( kv[0] === "advanced" ) {

          if ( kv[1] !== "0" ) {
            params.showAdvancedOptions = true;
          }

        }
      }
    }

    return params;
  }

  function collectParamsFromUiElements()
  {
    var params = {};
    params.server = document.getElementById("server").value;
    params.url = document.getElementById("inp-url").value;
    params.mode = document.getElementById("mode").value;
    params.enc = document.getElementById("enc").value;
    params.mobile = document.getElementById("mobile").value;
    params.dmap = document.getElementById("dmap").value;
    params.title = document.getElementById("inp-title").value;
    return params;
  }

  function getRedirectUrl()
  {
    var params = collectParamsFromUiElements();
    var outUrl = params.server;

    if ( params.server === "" ) { // use the current page as redir server
      var s = location.href;
      outUrl = s; // address bar
      var q = s.indexOf("?"); // look for "?"
      if ( q >= 0 ) outUrl = s.slice(0, q);
    }

    // remove "http://" and "https://" from the input url
    var url = params.url;
    url = url.split("\n")[0].trim(); // get the first line

    // remove the leading "http://" or "https://"
    var ret = URLHead.cut(url);
    if ( ret.err ) {
      url = "";
    } else {
      url = ret.url;
    }

    // removing the trailing "/"
    if ( url.length > 0 ) {
      var c = url.charAt(url.length - 1);
      if ( c === "/" ) {
        url = url.slice(0, url.length - 1);
      }
    }

    if ( url === "" ) {
      return null;
    }

    var args = [];

    var mode = params.mode;
    if ( mode !== "0" ) {
      args.push("mode=" + mode);
    }
    // if inline display (like frame.html) is need,
    // change https to http to avoid the mix content error
    if ( mode === "2" || mode === "3" ) {
      outUrl = outUrl.replace(/^https:\/\//g, "http://");
    }

    var enc = params.enc;
    if ( enc !== "0" ) { // "0" is the default encoding
      args.push("enc=" + enc);
    }

    var mobile = params.mobile;
    if ( mobile !== "" ) { // "" means auto
      args.push("mobile=" + mobile);
    }

    var dmap = params.dmap;
    if ( dmap !== "1" ) { // domain map is enabled by default
      args.push("dmap=" + dmap);
    }

    var title = params.title;
    if ( title.trim() !== "" ) {
      // for Chinese titles, URIB64 can hide the content while being coding efficient
      title = URIB64.encode(title, "~");
      args.push("title=" + title);
    }

    if ( enc === "1" ) {
      url = flippingEncode(url);
    } else if ( enc === "2" ) {
      url = URIB64.encode(url, "~");
    }
    if ( enc !== "none" ) {
      url = encodeURIComponent(url);
    }
    args.push("url=" + url);

    // form the final link
    outUrl += "?" + args.join("&");

    return outUrl;
  }

  function createRedirectUrl()
  {
    var outUrl = getRedirectUrl();
    if (outUrl !== null) {
      document.getElementById("out-url-group").style.display = "";
      var a = document.getElementById("out-url");
      a.innerHTML = outUrl;
      a.href = outUrl;  
    } else {
      // hide the output wrapper if url is empty
      document.getElementById("out-url-group").style.display = "none";
      var a = document.getElementById("out-url");
      a.innerHTML = "";
      delete a.href;
    }
  }

  function handleRequest(params)
  {
    // unpack parameters
    var url = params.url,
        mode = params.mode,
        enc = params.enc,
        title = params.title,
        mobile = params.mobile,
        dmap = params.dmap,
        wxRedirect = params.wxRedirect;

    // so we need to avoid that
    // decode the url
    if ( enc !== "none" ) {
      // 2020.8.28: remove additional parameters after url=
      // e.g. Weixin would appends "&from=timeline" when shared on Momemts
      // we can safely remove these parameters if any encoding scheme exists
      var pos;
      if ( (pos=url.indexOf("&")) >= 0 ) {
        url = url.slice(0, pos);
      }
      url = decodeURIComponent(url);
      if ( enc === "1" ) {
        url = flippingEncode(url);
      } else if ( enc === "2" ) {
        url = URIB64.decode(url);
      }
    } else {
      if ((pos=url.indexOf("&from=")) >= 0 ) {
        url = url.slice(0, pos);
      }
    }
    // prepend "http://" or "https://" if necessary
    url = URLHead.addBack(url);

    // replace dead domain names
    if ( window.DomainMap !== undefined && dmap !== "0" ) {
      var url1 = DomainMap.sub(url,
        {"randomPick": false, "findAll": false, "replaceAll": false});
      if ( url1 !== url ) {
        url = url1;
      }
    }
    document.getElementById("url").innerHTML = url;
    document.getElementById("url").dataUrl = url;

    if (wxRedirect == "1") {
      var wxUrl = "https://support.weixin.qq.com/cgi-bin/mmsupport-bin/readtemplate?t=w_redirect_taobao&url=" + encodeURIComponent(url);
      location.replace(wxUrl);
      return;
    }

    var action = getActionFromMode(mode);

    if ( action === "go" ) {
      location.href = url;
    } else if ( action === "prompt-redir" ) {
      setMobileViewport();
      document.getElementById("prompt-panel").style.display = "";
    } else if ( action === "embed" ) {
      if ( mobile === "1"
        || (mobile === "" && isMobileDevice()) ) {
        setMobileViewport();
      }
      document.getElementById("container").style.display = "none";
      var ifr = document.getElementById("embed-page");
      ifr.src = url;
      ifr.style.display = "";
    }

    if ( action !== "go" ) {
      // reset the page title
      var x = document.getElementsByTagName("TITLE")[0];
      if ( x ) {
        x.innerText = ( title !== "" ?  title : "." );
      }
    }
  }

  function installEventHandlers()
  {
    var comps = document.querySelectorAll(".input-component");
    for (var i = 0; i < comps.length; i++) {
      comps[i].addEventListener("change", function() {
        createRedirectUrl();
      })
    }

    var btn = document.getElementById("create-redirect-url");
    if (btn) {
      btn.addEventListener("click", function(){
        createRedirectUrl();
      });
    }

    var btnCopyTargetUrl = document.getElementById("copy-target-url");
    if (btnCopyTargetUrl) {
      btnCopyTargetUrl.addEventListener("click", function(){
        var el = document.getElementById("url");
        copyTextToClipboard(el.dataUrl, btnCopyTargetUrl);
        animateShow(el, [1.0, 300, 0.5, 200, 0.5, 500, 1.0]);
      });
    }

    var btnCopyRedirectUrl = document.getElementById("copy-redirect-url");
    if (btnCopyRedirectUrl) {
      btnCopyRedirectUrl.addEventListener("click", function(){
        var el = document.getElementById("out-url");
        copyTextToClipboard(el.href, btnCopyRedirectUrl);
        animateShow(el, [1.0, 300, 0.5, 200, 0.5, 500, 1.0]);
      });
    }

    var btnToggleAdvanced = document.getElementById("toggle-advanced-options");
    if (btnToggleAdvanced) {
      btnToggleAdvanced.addEventListener("click", function(){
        btnToggle(".advanced-options", btnToggleAdvanced);
      });
    }

    
  }

  function setMobileViewport() {
    var x = document.getElementById("viewport");
    x.name = "viewport";
    x.content = "width=device-width,initial-scale=1";
  }

  // main function
  function init() {
    var params = parseUrlParams();

    initUiElements(params);

    installEventHandlers();

    if (params.url === null) {
      // no url in address bar, show the generator panel
      setMobileViewport();
      document.getElementById("gen-panel").style.display = "";
    } else {
      // redirect the URL, show the content in an embedded page
      handleRequest(params);
    }
  }

  init();

})();
