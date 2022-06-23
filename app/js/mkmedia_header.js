(function(){

  var hostSubs = [
    {
      srcPath: "/extra/app/mkmedia.html",
      src: [
        /xljt\.cloud/,
      ],
      dest: [
        "163.app.jhrt3.com",
        "baidu.app.jhrt3.com",
        "sina.app.jhrt3.com",
        "sohu.app.jhrt3.com",
      ],
      destPath: "/mkmedia.html",
    },
    {
      srcPath: "/mkmedia.html",
      src: [
        /app.*\.bhffer.*\.com/,
        // /localhost/,
      ],
      dest: [
        "163.app.jhrt3.com",
        "baidu.app.jhrt3.com",
        "sina.app.jhrt3.com",
        "sohu.app.jhrt3.com",
      ],
      destPath: "/mkmedia.html",
    },
    {
      srcPath: "/app/mkmedia.html",
      src: [
        /^bhffer.*\.com/,
      ],
      dest: [
        "163.app.jhrt3.com",
        "baidu.app.jhrt3.com",
        "sina.app.jhrt3.com",
        "sohu.app.jhrt3.com",
      ],
      destPath: "/mkmedia.html",
    },
  ];
  
  function replaceDomain() {
    var h=location.host, href=location.href;

    if (href.indexOf("?")>0) { // replace domains
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
            if (hs.dest.length > 0) {
              // randomly jump to one of destinations
              k = Math.floor(Math.random()*hs.dest.length);
              href = href.replace(h, hs.dest[k]); // replace the host
              if (hs.srcPath !== undefined && hs.destPath !== undefined) {
                href = href.replace(hs.srcPath, hs.destPath);
              }
            }
            break;
          }
        }
      }
    }
    return href;
  }

  function updateTimeStamp(href) {
    var now=Math.floor(new Date().getTime()/1e6).toString(36),
    r=href.match(/[\?\&]t=([^\?\&#]+)/i),hv=null;
    if(r!==null)hv=unescape(r[1]);
    var p=href.indexOf("?"),q=href.indexOf("#"),hash="";
    if(q>=0){href=href.slice(0, q);hash=href.slice(q);}
    if(p<0){href+="?t="+now+hash;}
    else if(hv===null){if(href.slice(-1)!=="&")href+="&";href+="t="+now+hash;}
    else if(hv!=now){href=href.replace("t="+hv,"t="+now);}
    return href;
  }

  //var href = replaceDomain();
  href = location.href;

  // update the time stamp
  href = updateTimeStamp(href);

  if (href !== location.href) {
    //document.write('<meta http-equiv="refresh" content="0;url='+href.replace(/["]/g,"&quot;")+'">');
    location.replace(href);
  }

})();
