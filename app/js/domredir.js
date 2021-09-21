(function(){
  hostSubs = [
    {
      src: [
        /xljt\.cloud/,
        /xljtsub1\.com/,
        "sina.xljtsub1.com",
        "qq.xfiny1.com",
        "tv.xfiny1.com",
        "bln.xfiny1.com",
        "xyz.xfiny1.com",
        "wat.xfiny1.com",
      ],
      dest: [
        "qq.uctv1.com",
        "brew.uctv1.com",
        "dir.uctv1.com",
        "pwd.uctv1.com",
      ],
      dest2: [
      ],
      proba: 1.0,
    },
    {
      src: [
        /app\.bhffer\.com/,
        /app\.bhffer1\.com/,
        /app\.bhffer2\.com/,
        /app\.bhffer3\.com/,
        "c.app.cb8cb.com",
        "b.app.cb8cb.com",
        "x.app.cb8cb.com",
        "s.app.cb8cb.com",
        "c.app.jscb2.com",
        "b.app.jscb2.com",
        "x.app.jscb2.com",
        "s.app.jscb2.com",
      ],
      dest: [
        "c.app.jscb1.com",
        "b.app.jscb1.com",
        "x.app.jscb1.com",
        "s.app.jscb1.com",
        "baidu.app.jscb1.com",
        "sina.app.jscb1.com",
        "apple.app.jscb1.com",
      ],
      dest2: [
      ],
      proba: 1.0,
    },
    {
      src: [
        /xf123\.rf\.gd/,
        "balance.app.shcut2.com",
        "diligence.app.shcut2.com",
        "discipline.app.shcut2.com",
        "forbearance.app.shcut2.com",
        "sympathy.app.shcut2.com",
      ],
      dest: [
        "app.xf8.site",
      ],
      proba: 1.0,
    },
    {
      src: [
        /xf8\.great-site\.net/,
        /bhff\.infinityfreeapp\.com/,
        "balance.js1go.com",
        "hope.js1go.com",
        "moderation.js1go.com",
        "tolerance.js1go.com",
        "joy.js1go.com",
        "apple.inc1z.com",
        "tree.inc1z.com",
      ],
      dest: [
        "abc.inc1a.com",
        "nbc.inc1a.com",
        "cbc.inc1a.com",
        "give.inc1z.com",
        "peace.inc1z.com",
        "wisdom.inc1z.com",
      ],
      destb: [
        "xfabc.epizy.com",
      ],
      proba: 1.0,
    },
  ];
  h = location.host;
  if (location.href.indexOf("?") > 0) {
    // loop over hostSubs
    for (match = false, i = 0; i < hostSubs.length && !match; i++) {
      hs = hostSubs[i];
      for (src = hs.src, j = 0; j < src.length; j++) {
        if (src[j].exec(h)) {
          // randomly jump to one of destinations
          if (Math.random() < hs.proba) {
            k = Math.floor(Math.random()*hs.dest.length);
            location.href = location.href.replace(h, hs.dest[k]);
          }
          match = true;
          break;
        }
      }
    }
  }
})();
