(function() {
  var data = [
  {
    "name": "tzbk",
    "live": [
      "web2orrichardlu.one"
    ],
    "dead": [
      "lujunhong2or.com",
      "bloglurichardnet.site",
      "bloglunetmaster.com",
      "webmaster2orlu.online",
      "bloglumasterweb.org",
      "blogjunhonglunet.com",
      "webrichard2orlu.com",
      "richardlumaster.info",
      "blogjunhongmaster.org",
      "web2orjunhong.com",
      "webmaster2or.org",
      "blogweblumaster.org",
      "lumasterblog.org",
      "blogweblujunhong.net",
      "blogjunhongluweb.com",
      "webmaster2orlu.org",
      "blogjunhongweb.com",
      "blogwebrichardlu.org",
      "web2orrichardlu.com",
      "bloglunetrichard.com",
      "www.web2orlujunhong.org",
      "blogwebrichard.com",
      "blogjunhonglunet.org",
      "bloglumasterweb.net",
      "junhong2or.net",
      "web2orlujunhong.com",
      "net2orrichard.online",
      "bloglumasterweb.net"
    ]
  },
  {
    "name": "wgw",
    "live": [
      "xlch39.com"
    ],
    "dead": [
      "xlch.org",
      "xlch38.com",
      "xlch37.com",
      "xlch36.com",
      "xlch35.com",
      "xlch34.com",
      "xlch33.com",
      "xlch32.com",
      "xlch31.com",
      "xlch30.com",
      "xlch29.com",
      "xlch28.com",
      "xlch27.com",
      "xlch26.com",
      "xlch25.com",
      "xlch24.com",
      "xlch23.com",
      "xlch22.com",
      "xlch21.com",
      "xlch20.com",
      "xlch19.com",
      "xlch18.com",
      "xlch17.com",
      "xlch16.com",
      "xlch15.com",
      "xlch14.com",
      "xlch13.com",
      "xlch12.com",
      "xlch11.com",
      "xlch10.com",
      "xlch9.com",
      "xlch8.com",
      "xlch7.com",
      "xlch6.com",
      "xlch5.com",
      "xlch4.com",
      "xlch3.com",
      "xlch2.com",
      "xlch1.com",
      "xlch.com"
    ]
  },
  {
    "name": "mflh",
    "live": [
      "baidu.haiweivipmflotuscibei.cloud/gegsyps/weibo"
    ],
    "dead": [
      "baidu.mfxlianhua.cloud/gegsyps/weibo",
      "vip.lianhuapureland.cloud/gegsyps/weibo",
      "vip.tech.mflianhua.cloud/gegsyps/weibo",
      "baidu.mflianhua.best/gegsyps/weibo",
      "m.sina.cbxs.mfchyuts.com/baidu/luntan/fofa1",
      "new.mfchyuts.com/baidu/luntan/fofa1",
      "m.baidu.mulotus.fabushi.cloud/baidu/luntan/fofa1",
      "baidu.new.mflotus.com/baidu/luntan/fofa1",
      "new.mflotus.com/baidu/luntan/fofa1",
      "mflotus.com/baidu/luntan/fofa1"
    ]
  },
  {
    "name": "caxl",
    "live": [
      "vip.blessedca.cloud/fofa/bbs",
      "vip.gycciai.cloud/fofa/bbs",
      "vip.xlpureland.cloud/fofa/bbs",
      "sina.lotusciai.cloud/fofa/bbs",
      "sina.meritlotus.cloud/fofa/bbs",
      "www.sina.caxlotus.com/fofa/bbs",
      "sina.caxlotus.com/fofa/bbs"
    ],
    "dead": [
      "www.baidu.caxlotus.com/fofa/bbs",
      "baidu.caxlotus.com/fofa/bbs",
      "baidu.blisslotus.cloud/fofa/bbs"
    ]
  },
  {
    "name": "xlys",
    "live": [
      "www.ifeng.xlfmw.cloud",
      "www.baidu.xlfmw.cloud",
      "www.baidu.xly2.cloud"
    ],
    "dead": [
      "www.baidu.xlys.cloud",
      "baidu.xlys.cloud",
      "baidu.app.xlfmwang.org",
      "baidu.v.xlfmwang.org",
      "baidu.video.xlfmwang.org",
      "weibo.yun.xlfmwang.org",
      "www.xlfmwz.com",
      "xlfmwz.com"
    ]
  },
  {
    "name": "jchz",
    "live": [
      "www.baidu.wonderfulsummary.com/sinaweb/jchz",
      "www.baidu.jchz68686568.com/sinaweb/jchz",
      "www.baidu.lujiajun8.com/sinaweb/jchz"
    ],
    "dead": [
    ]
  },
  {
    "name": "balh",
    "live": [
      "www.balh01.com/cn/bbs"
    ],
    "dead": [
    ]
  },
  {
    "name": "xf8",
    "live": [
      "xf8.club"
    ],
    "dead": [
      "xfabc.xyz"
    ]
  },
  {
    "name": "xf123",
    "live": [
      "xf123.rf.gd",
      "xfabc.rf.gd"
    ],
    "dead": [
      "xf8.rf.gd"
    ]
  }
  ];

  // substitute dead domain occurrences by a live one
  // if opt.randomPick is true, the live alternative is picked up randomly,
  //    otherwise, the first choice is used
  // if opt.replaceAll is true, multiple occurrences are matched
  // if opt.findAll is true, assume the input contains different
  //    dead domains, and all of them are matched,
  //    otherwise, the function stops at the first match
  var sub = function(url, opt) {
    if ( opt === undefined ) opt = {};

    var i, obj, live, j, dead, p0, p, k;
    for ( i = 0; i < data.length; i++ ) {
      obj = data[i];
      for ( j = 0; j < obj.dead.length; j++ ) {
        dead = obj.dead[j];
        // loop over multiple occurrences of `dead`
        for ( p0 = 0; ; ) {
          p = url.indexOf(dead, p0);
          if ( p < 0 ) break;
          // choose a live alternative
          if ( opt.randomPick ) {
            k = Math.floor(Math.random() * obj.live.length);
            live = obj.live[k];
          } else {
            live = obj.live[0];
          }
          url = url.slice(0, p) + live + url.slice(p + dead.length);
          if ( !opt.findAll ) return url;
          if ( !opt.replaceAll ) break;
          // update the index
          p0 += p + live.length;
        }
      }
    }
    return url;
  };

  window.DomainMap = {
    "sub": sub,
  };
}());

