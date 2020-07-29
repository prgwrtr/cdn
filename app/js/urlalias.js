"use strict";

var URLAlias = {
  defAliasArray: [
    [/https?:\/\/video\.wixstatic\.com\/video\/(.*?)\/mp4\/file\.mp4/g, "~w4-$1~",
     /~w4-(.*?)~/g, "https://video.wixstatic.com/video/$1/mp4/file.mp4"]
    ,
    [/https?:\/\/static\.wixstatic\.com\/mp3\/(.*?)\.mp3/g, "~w3-$1~",
     /~w3-(.*?)~/g, "https://static.wixstatic.com/mp3/$1.mp3"]
    ,
    [/https?:\/\/static\.wixstatic\.com\/media\/(.*?)~mv2\.jpg/g, "~wj-$1~",
     /~wj-(.*?)~/g, "http://static.wixstatic.com/media/$1~mv2.jpg"]
    ,
    [/https?:\/\/dmp3b-web\.cdn\.xldhplay\.com\/mp3\/(.*?)\.mp3/g, "~d3-$1~",
     /~d3-(.*?)~/g, "http://dmp3b-web.cdn.xldhplay.com/mp3/$1.mp3"]
    ,
    [/https?:\/\/i3\.vzan\.cc\/upload\/video\/mp4\/(.*?)\.mp4/g, "~v4-$1~",
     /~v4-(.*?)~/g, "https://i3.vzan.cc/upload/video/mp4/$1.mp4"]
    ,
    [/https?:\/\/i3\.vzan\.cc\/upload\/audio\/mp3\/(.*?)\.mp3/g, "~v3-$1~",
     /~v3-(.*?)~/g, "https://i3.vzan.cc/upload/audio/mp3/$1.mp3"]
    ,
    [/https?:\/\/i2\.vzan\.cc\/upload\/image\/jpg\/(.*?)\.jpg/g, "~vj-$1~",
     /~vj-(.*?)~/g, "https://i2.vzan.cc/upload/image/jpg/$1.jpg"]
    ,
    [/https?:\/\/i2\.vzan\.cc\/upload\/image\/png\/(.*?)\.png/g, "~vp-$1~",
     /~vp-(.*?)~/g, "https://i2.vzan.cc/upload/image/png/$1.png"]
    ,
    [/https?:\/\/i3\.vzan\.cc\/video\/livevideo\/mp4\/(.*?)\.mp4/g, "~V4-$1~",
     /~V4-(.*?)~/g, "https://i3.vzan.cc/video/livevideo/mp4/$1.mp4"]
    ,
    [/https?:\/\/i3\.vzan\.cc\//g, "~vi3~",
     /~vi3~/g, "https://i3.vzan.cc/"]
    ,
    [/https?:\/\/i\.postimg\.cc\/(.*?)/g, "~pi-$1~",
     /~pi-(.*?)~/g, "https://i.postimg.cc/$1"]
    ,
    [/https?:\/\/t\.cn\//g, "~t~",
     /~t~/g, "http://t.cn/"]
    ,
    [/https?:\/\/bit\.ly\//g, "~b~",
     /~b~/g, "https://bit.ly/"]
    ,
    [/http:\/\//g, "~h~",
     /~h~/g, "http://"]
    ,
    [/https:\/\//g, "~H~",
     /~H~/g, "https://"]
    ,
  ],

  toAlias: function(s, arr) {
    var i, alias, real;
    if ( arr === undefined ) arr = URLAlias.defAliasArray;
    for ( i = 0; i < arr.length; i++ ) {
      real = arr[i][0];
      alias = arr[i][1];
      s = s.replace(real, alias);
    }
    return s;
  },

  fromAlias: function(s, arr) {
    var i, alias, real;
    if ( arr === undefined ) arr = URLAlias.defAliasArray;
    for ( i = 0; i < arr.length; i++ ) {
      alias = arr[i][2];
      real = arr[i][3];
      s = s.replace(alias, real);
    }
    return s;
  },

  toAliasX: function(s, arr) {
    var t = URLAlias.toAlias(s, arr),
        r = URLAlias.fromAlias(t, arr), // try to recover the original s
        err = 0;
    if ( s !== r ) { // fail to recover
      t = s;
      err = 1;
    }
    return {"s": t, "err": err};
  }
};

/*
var x, y, z, a, i;
a = ["https://static.wixstatic.com/mp3/afb378_9c977eb13064413d8685424740d59d5c.mp3",
"https://video.wixstatic.com/video/f8324d_1450c65d13d5494183890c93b5ce84c6/480p/mp4/file.mp4",
"https://i3.vzan.cc/upload/audio/mp3/20200220/249eee1e46cc46a5864131acf136053c.mp3",
"https://i3.vzan.cc/upload/video/mp4/20200614/82a09afb5f0548c7a0de4d8d1fd36a65.mp4",
"https://i3.vzan.cc/video/livevideo/mp4/20190927/ae344d4e437d46389ba0d7df5bc91179.mp4",
];
for ( i = 0; i < a.length; i++ ) {
  y = URLAlias.toAlias(x = a[i]);
  z = URLAlias.fromAlias(y);
  alert(x + " " + y + " " + z + " " + (x === z));
}
*/
