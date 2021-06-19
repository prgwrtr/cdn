(function(){
  h = location.host;
  if (location.href.indexOf("?")>0) {
    if (/app\.bhffer\.com/.exec(h)) {
      if ((r=Math.random()) < 0.2) {
        location.href = location.href.replace(h,"cbxs".charAt(Math.floor(Math.random()*4))+".jsappl.com");
      } else if (r < 0.4) {
        location.href = location.href.replace(h,"xf123.rf.gd");
      } else if (r < 0.6) {
        location.href = location.href.replace(h,"bhff.infinityfreeapp.com/app");
      } else if (r < 0.8) {
        location.href = location.href.replace(h,"kindness.lovestoblog.com/app");
      } else {
        location.href = location.href.replace(h,"xf8.great-site.net/app");
      }
    } else if (/app[0-9]+\.bhffer\.com/.exec(h)) {
      if ((r=Math.random()) < 0.3) {
        location.href = location.href.replace(h,"jdh".charAt(Math.floor(Math.random()*3))+".xsmartie.com");
      } else if (r < 0.4) {
        location.href = location.href.replace(h,"xf123.rf.gd");
      } else if (r < 0.8) {
        location.href = location.href.replace(h,"xfabc.epizy.com/app");
      } else if (r < 0) { // unable to visit
        location.href = location.href.replace(h,"cbxs.freecluster.eu/app");
      } else {
        location.href = location.href.replace(h,"app.xf8.site");
      }
    }
  }
})();
