(function(){
  h = location.host;
  if (location.href.indexOf("?")>0) {
    if (/sina\.xljt\.cloud/.exec(h)
     || /zhihuicibeixishev\.cloud/.exec(h)) {
      var servers = [
        "c.xljtsub1.com",
        "b.xljtsub1.com",
        "x.xljtsub1.com",
        "s.xljtsub1.com",
        "baidu.xljtsub1.com",
        "sina.xljtsub1.com",
        "apple.xljtsub1.com",
        "c.xljtsub3.com",
        "b.xljtsub3.com",
        "x.xljtsub3.com",
        "s.xljtsub3.com",
        "sina.xljtsub3.com",
        "baidu.xljtsub3.com",
        "apple.xljtsub3.com",
        "c.xlpureland1.com",
        "b.xlpureland1.com",
        "x.xlpureland1.com",
        "s.xlpureland1.com",
        "sina.xlpureland1.com",
        "baidu.xlpureland1.com",
        "apple.xlpureland1.com",
        "c.xljingtu1.com",
        "b.xljingtu1.com",
        "x.xljingtu1.com",
        "s.xljingtu1.com",
        "sina.xljingtu1.com",
        "baidu.xljingtu1.com",
        "apple.xljingtu1.com",
        "c.xljingtu2.com",
        "b.xljingtu2.com",
        "x.xljingtu2.com",
        "s.xljingtu2.com",
        "sina.xljingtu2.com",
        "baidu.xljingtu2.com",
        "apple.xljingtu2.com",
      ];
      if (Math.random() < 1.0) {
        i = Math.floor(Math.random()*servers.length);
        location.href = location.href.replace(h, servers[i]);
      }
    } else if (/app\.bhffer\.com/.exec(h)) {
      if ((r=Math.random()) < 0.997) {
        var servers = [
          //"app.bhffer1.com",
          //"app.bhffer2.com",
          "c.app.bhffer1.com",
          "b.app.bhffer1.com",
          "x.app.bhffer1.com",
          "s.app.bhffer1.com",
          "sina.app.bhffer1.com",
          "baidu.app.bhffer1.com",
          "apple.app.bhffer1.com",
          "c.app.bhffer2.com",
          "b.app.bhffer2.com",
          "x.app.bhffer2.com",
          "s.app.bhffer2.com",
          "sina.app.bhffer2.com",
          "baidu.app.bhffer2.com",
          "apple.app.bhffer2.com",
          "c.app.bhffer3.com",
          "b.app.bhffer3.com",
          "x.app.bhffer3.com",
          "s.app.bhffer3.com",
          "sina.app.bhffer3.com",
          "baidu.app.bhffer3.com",
          "apple.app.bhffer3.com",
        ];
        i = Math.floor(Math.random()*servers.length);
        location.href = location.href.replace(h, servers[i]);
        //location.href = location.href.replace(h,"cbxs".charAt(Math.floor(Math.random()*4))+".jsappl.com");
      } else if (r < 0.998) {
        location.href = location.href.replace(h,"xf123.rf.gd");
      } else if (r < 0.999) {
        location.href = location.href.replace(h,"bhff.infinityfreeapp.com/app");
      } else {
        location.href = location.href.replace(h,"xf8.great-site.net/app");
      }
    } else if (/app[0-9]+\.bhffer\.com/.exec(h)) {
      if ((r=Math.random()) < 0.0) { // banned in wechat
        location.href = location.href.replace(h,"jdh".charAt(Math.floor(Math.random()*3))+".xsmartie.com");
      } else if (r < 1.0) { // disable
        location.href = location.href.replace(h,"xfabc.epizy.com/app");
      } else if (r < 1.0) { // banned in wechat
        location.href = location.href.replace(h,"kindness.lovestoblog.com/app");
      } else if (r < 1.0) { // banned in wechat
        location.href = location.href.replace(h,"cbxs.freecluster.eu/app");
      } else {
        location.href = location.href.replace(h,"app.xf8.site");
      }
    }
  }
})();
