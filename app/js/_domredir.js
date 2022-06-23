// for transition from app/redir.html of the initial sites
// to app/redir/redir.php of a hub site

(function(){
  hostSubs = [
    {
      src: [
        /xljt\.cloud/,
        /xljtsub1\.com/,
        /xfiny1\.com/,
      ],
      srcPath: "/extra/app/redir.html",
      dest: [
        "tv.xfiny1.com",
        "bln.xfiny1.com",
        "xyz.xfiny1.com",
        "wat.xfiny1.com",
      ],
      destPath: "/app/redir/redir.php",
      dest2: [
        "sina.xljtsub1.com",
      ],
      wxRedirProba: 1.0,
      proba: 1.0,
    },
  ];

  function isWeixin()
  {
    return !!navigator.userAgent.match(/MicroMessenger/i);
  }

  function wxRedirect(url, wxRedirProba)
  {
    if (!isWeixin()
        || wxRedirProba === undefined
        || Math.random() > wxRedirProba) {
      return url;
    }

    var p = href.indexOf("?");
    if (p > 0 && href.indexOf("wx_redirect=1") < 0) {
      url = url.slice(0, p+1) + "wx_redirect=1&" + url.slice(p+1);
    }
    window.wxRedirected = true;
    return url;
  }

  function updateTimeStamp(href) {
    // update the time stamp every 30 seconds (3e4ms)
    var now = Math.floor(new Date().getTime()/3e4).toString(36),
        r = href.match(/[\?\&]t=([^\?\&#]+)/i), hv = null;
    if (r !== null) hv = unescape(r[1]);
    var p = href.indexOf("?"), q = href.indexOf("#"), hash = "";
    if (q >= 0) {
      hash = href.slice(q);
      href = href.slice(0, q);
    }
    if (p < 0) { // no "?" in the URL
      href += "?t=" + now + hash;
    } else if (hv === null) { // has "?", but no "t="
      href = href.slice(0, p) + "?t=" + now + "&" + href.slice(p+1) + hash;
    } else if (hv !== now) { // outdated
      href = href.replace("t=" + hv, "t=" + now);
    }
    return href;
  }

  function redirectUrl(url, method) {
    if (method === "location") {
      location.replace(url);
    } else {
      document.write('<meta http-equiv="refresh" content="0;url=' + url.replace(/["]/g, "&quot;") + '">');
    }
  }

  h = location.host;
  href = location.href;
  if (href.indexOf("?") > 0) {
    // loop over hostSubs
    for (matched = false, i = 0; !matched && i < hostSubs.length; i++) {
      hs = hostSubs[i];

      // if the host's source path is given and it doesn't match
      // the current path, skip to the next host
      if (hs.srcPath !== undefined && hs.srcPath !== location.pathname) {
        continue;
      }

      for (src = hs.src, j = 0; j < src.length; j++) {
        if ( (typeof(src[j]) == "object" && src[j].exec(h))
          || (typeof(src[j]) == "string" && h.indexOf(src[j]) >= 0) ) {
          matched = true;

          href = wxRedirect(href, hs.wxRedirProba);
          if (window.wxRedirected) { // variable set in wxRedirect() above
            break; // fall through to redir.js
          }

          if (hs.dest.length > 0) {
            // randomly jump to one of destinations
            if (Math.random() < hs.proba) {
              k = Math.floor(Math.random()*hs.dest.length);
              href = href.replace(h, hs.dest[k]); // replace the host
              if (hs.srcPath !== undefined && hs.destPath !== undefined) {
                href = href.replace(hs.srcPath, hs.destPath);
              }
              // update the time stamp
              href = updateTimeStamp(href);

              // if we have decided to redirect, add a user-agent token to the URL
              var result = UaToken.addToken(href);
              href = result.url;

              //redirectUrl(href);
              location.replace(href);
            }
          }
          break;
        }
      }
    }
    // matching failed
    // update the time stamp
    newHref = updateTimeStamp(href);
    if (href !== newHref) {
      location.replace(newHref);
    }
  } // if (href.indexOf("?") > 0)
})();
