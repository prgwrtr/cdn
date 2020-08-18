"use strict";

// https://stackoverflow.com/a/11381730/13612859
window.isMobile = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

// encode a string by 1. flipping and 2. randomly swapping some letters
// calling this function twice gives the original back
function flipenc(s) {
  var i, n = s.length, t = "", c, p;
  var tab = "%/:?&=.monhtpqjJZz-_";
  for ( i = 0; i < n; i++ ) {
    var c = s.charAt(i);
    var p = tab.indexOf(c);
    if ( p >= 0 ) {
      c = tab.charAt(tab.length - 1 - p);
    }
    t = c + t;
    //console.log(i, s.charAt(i), c, p);
  }
  return t;
}

function genLink()
{
  var server = document.getElementById("server").value,
      outurl = server;

  if ( server === "" ) { // use the current page as redir server
    var s = location.href;
    outurl = s; // address bar
    var q = s.indexOf("?"); // look for "?"
    if ( q >= 0 ) outurl = s.slice(0, q);
  }

  // remove "http://" and "https://" from the input url
  var url = document.getElementById("inp-url").value;
  url = url.split("\n")[0].trim(); // get the first line
  var ret = URLHead.cut(url);
  if ( ret.err || ret.url === "" ) {
    document.getElementById("out-url-wrapper").style.display = "none";
    var a = document.getElementById("out-url");
    a.innerHTML = "";
    a.href = "#";
    return;
  }
  url = ret.url;

  var args = [];

  var mode = document.getElementById("mode").value;
  if ( mode !== "0" ) {
    args.push("mode=" + mode);
  }
  // if inline display (like frame.html) is need,
  // change https to http to avoid the mix content error
  if ( mode === "2" || mode === "3" ) {
    outurl = outurl.replace(/^https:\/\//g, "http://");
  }

  var enc = document.getElementById("enc").value;
  if ( enc !== "0" ) { // "0" is the default encoding
    args.push("enc=" + enc);
  }

  var mobile = document.getElementById("mobile").value;
  if ( mobile !== "" ) { // "" means auto
    args.push("mobile=" + mobile);
  }

  var dmap = document.getElementById("dmap").value;
  if ( dmap !== "1" ) { // domain map is enabled by default 
    args.push("dmap=" + dmap);
  }

  var title = document.getElementById("inp-title").value;
  if ( title.trim() !== "" ) {
    // for Chinese titles, URIB64 can hide the content while being coding efficient
    title = URIB64.encode(title, "~");
    args.push("title=" + title);
  }

  if ( enc === "1" ) {
    url = flipenc(url);
  } else if ( enc === "2" ) {
    url = URIB64.encode(url, "~");
  }
  if ( enc !== "none" ) {
    url = encodeURIComponent(url);
  }
  args.push("url=" + url);

  // form the final link
  outurl += "?" + args.join("&");

  document.getElementById("out-url-wrapper").style.display = "";
  var a = document.getElementById("out-url");
  a.innerHTML = outurl;
  a.href = outurl;
}

// things to do after the link is shortened
function linkShortened(surl)
{
  var el = document.getElementById("out-url");
  el.innerHTML = surl;
  el.href = surl;
  animateShow(el, [1.0, 700, 0.4, 500, 0.4, 800, 1.0]);
}

function shortenLink()
{
  var s = document.getElementById("out-url").href;
  // shortenURL() is defined in com1.js
  shortenURL(s, 'bit.ly', linkShortened);
}

function copyLink(cpbtn) {
  var s = document.getElementById("out-url").href;
  copyTextToClipboard(s, cpbtn);
  animateShow("out-url", [1.0, 1000, 1.0, 700, 0.4, 500, 0.4, 800, 1.0]);
}

function copyURL(cpbtn) {
  var s = document.getElementById("url").innerHTML;
  copyTextToClipboard(s, cpbtn);
  animateShow("url", [1.0, 300, 0.5, 200, 0.5, 500, 1.0]);
}

function setMobileViewport() {
  var x = document.getElementById("viewport");
  x.name = "viewport";
  x.content = "width=device-width,initial-scale=1";
}

function handleInputURL(url, mode, enc, title, mobile, dmap)
{
  var x, i;

  // decode the url
  if ( enc !== "none" ) {
    url = decodeURIComponent(url);
    if ( enc === "1" ) {
      url = flipenc(url);
    } else if ( enc === "2" ) {
      url = URIB64.decode(url);
    }
  }
  // prepend "http://" or "https://" if necessary
  url = URLHead.addBack(url);

  // replace dead domain names
  if ( window.DomainMap && dmap !== "0" ) {
    var url1 = DomainMap.sub(url,
      {"randomPick": false, "findAll": false, "replaceAll": false});
    if ( url1 !== url ) {
      //alert("DomainMap: " + url + " => " + url1);
      console.log("DomainMap: " + url + " => " + url1);
      url = url1;
    }
  }
  document.getElementById("url").innerHTML = url;

  // check if the browser is Wechat
  var isWechat = !!navigator.userAgent.match(/MicroMessenger/i), action;

  if ( mode === "0" ) { // prompt for redirection if in wechat
    if ( isWechat ) action = "prompt-redir";
    else action = "go";
  } else if ( mode === "1" ) { // always prompt for redirection
    action = "prompt-redir";
  } else if ( mode === "2" ) { // embed webpage if in wechat
    if ( isWechat ) action = "embed";
    else action = "go";
  } else if ( mode === "3" ) {
    action = "embed";
  } else if ( mode === "go" ) {
    action = "go";
  }

  if ( action === "go" ) {
    location.href = url;
  } else if ( action === "prompt-redir" ) {
    setMobileViewport();
    document.getElementById("redir-panel").style.display = "";
  } else if ( action === "embed" ) {
    if ( mobile === "1"
      || (mobile === "" && isMobile()) ) {
      setMobileViewport();
    }
    document.getElementById("container").style.display = "none";
    var ifr = document.getElementById("embed-page");
    ifr.src = url;
    ifr.style.display = "";
  }

  if ( action !== "go" ) {
    // reset the page title
    x = document.getElementsByTagName("TITLE")[0];
    if ( x ) {
      x.innerHTML = ( title !== "" ?  title : "." );
    }
  }

}

(function(){
  // main function
  var s, p, q, args, url = undefined, mode = "0", enc = "0", mobile = "", dmap = "1", title = "", i, kv;
  s = location.href; // address bar
  q = s.indexOf("?"); // look for "?"
  if ( q >= 0 ) {
    s = s.slice(q+1); // get the arguments

    // look for url in the address bar
    p = s.indexOf("url="); // look for "url="
    if ( p >= 0 ) {
      args = s.slice(0,p);
      url = s.slice(p+4); // everything after "url="
    } else {
      args = s;
    }

    args = args.split("&");
    for ( i = 0; i < args.length; i++ ) {
      kv = args[i].split("=");

      if ( kv[0] === "mode" ) {
        if ( kv[1] !== undefined && kv[1] !== "" ) {
          mode = kv[1];
        } else {
          mode = "0";
        }
        document.getElementById("mode").value = mode;

      } else if ( kv[0] === "enc" ) {
        if ( kv[1] !== undefined && kv[1] !== "" ) {
          enc = kv[1];
        } else {
          enc = "1"; // this is the default when parameter "enc" exists
        }
        document.getElementById("enc").value = enc;

      } if ( kv[0] === "title" ) {
        if ( kv[1] !== undefined && kv[1] !== "" ) {
          title = URIB64.decode(kv[1]);
        } else {
          title = "";
        }
        document.getElementById("title").innerHTML = title;

      } else if ( kv[0] === "mobile" ) {
        if ( kv[1] !== undefined && kv[1] !== "" ) {
          mobile = kv[1];
        } else {
          mobile = "1"; // this is the default when parameter "mobile" exists
        }
        document.getElementById("mobile").value = mobile;

      } else if ( kv[0] === "dmap" ) {
        if ( kv[1] !== undefined && kv[1] !== "" ) {
          dmap = kv[1];
        } else {
          dmap = "1"; // this is the default when parameter "dmap" exists
        }
        document.getElementById("dmap").value = dmap;

      } else if ( kv[0] === "advanced" ) {
        if ( kv[1] !== "0" ) {
          document.getElementById("advanced-options").style.display = "";
        }
      }
    }
  }

  if ( url === undefined ) {
    // no url in address bar, show the generation panel
    setMobileViewport();
    document.getElementById("gen-panel").style.display = "";
  } else { // open the link
    handleInputURL(url, mode, enc, title, mobile, dmap);
  }
})();
