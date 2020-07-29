"use strict";
var URIB64 = {
  once: false,

  quote: "_", // quotation mark
  b64: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.-",
  imap: {"": 0}, // from b64 character to its index in b64

  // for ASCII characters (x < 128) not in b64
  a2b: {}, // from an excluded ASCII character to a b64 character
  b2a: {}, // from a b64 character to an excluded ASCII character

  init: function() {
    var i, x, c;
    // create an inverse mapping
    for ( i = 0; i < URIB64.b64.length; i++ ) {
      URIB64.imap[ URIB64.b64.charAt(i) ] = i;
    }
    // map the remaining ASCII characters to b64 characters
    // for the pair representation, e.g. "-0", "-A", etc
    for ( i = 0, x = 1; x < 128; x++ ) {
      c = String.fromCharCode(x);
      if ( URIB64.b64.indexOf(c) < 0 ) {
        // allocate the next available b64 character i to x
        var c64 = URIB64.b64.charAt(i++);
        URIB64.a2b[c] = c64;
        URIB64.b2a[c64] = c;
      }
    }

    URIB64.once = true;
  },

  encode: function(s, whitelist) {
    var t, i, x, c, b;
    if ( whitelist === undefined ) whitelist = "";
    // exclude the quote from the whitelist, as it is used for quoting
    whitelist = whitelist.replace(URIB64.quote, "");
    whitelist += URIB64.b64;
    for ( t = "", i = 0; i < s.length; ) {
      // charCodeAt() will always return a value less than 65536 (0x10000)
      c = s.charAt(i);
      if ( whitelist.indexOf(c) >= 0 ) {
        // copy characters in the whitelist verbatim
        t += c;
        i++;
      } else if ( (b=URIB64.a2b[c]) !== undefined ) {
        // use two characters for the rest of the ASCII characters
        t += URIB64.quote + b;
        i++;
      } else {
        // start a unicode block
        // use two or three characters to represent a JavaScript character unit
        // the return of String.charCodeAt() is always less than 0x10000, cf.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
        // hence it can always be represented in three base-64 charaters
        t += URIB64.quote + URIB64.b64.charAt(63);
        // NOTE: a more aggressive encoder can look ahead to
        // see if the whitelist string is shorter than 5 characters
        // before terminating the block
        // it will improve efficiency, but increase coding complexity
        for ( ; i < s.length && whitelist.indexOf(c=s.charAt(i)) < 0; i++ ) {
          x = c.charCodeAt(0);
          if ( x < 1024 ) {
            // code it in two characters
            t += URIB64.b64.charAt(0x10|(x>>6))
               + URIB64.b64.charAt(x&0x3f);
          } else {
            // code it in three characters
            t += URIB64.b64.charAt(x>>12)
               + URIB64.b64.charAt((x>>6)&0x3f)
               + URIB64.b64.charAt(x&0x3f);
          }
        }
        t += URIB64.quote;
      }
    }
    return t;
  },

  decode: function(t) {
    var s = "", i = 0, c, c1, j, w, k, x;
    while ( i < t.length ) {
      c = t.charAt(i);
      if ( c === URIB64.quote ) {
        c1 = t.charAt(++i);
        if ( c1 === URIB64.b64.charAt(63) ) { // unicode coding block
          j = t.indexOf(URIB64.quote, i+1);
          if ( j < 0 ) j = t.length - 1;
          w = t.substring(i+1, j);
          for ( k = 0; k < w.length; ) {
            x = URIB64.imap[w.charAt(k)];
            if ( x & 0x20 ) {
              console.log("Error: corruption in decoding " + w + " @ " + i);
              break;
            } else if ( x & 0x10 ) { // two-character coding
              s += String.fromCharCode( ((x&0xf)<<6)
                | URIB64.imap[w.charAt(k+1)] );
              k += 2;
            } else { // three-character coding
              s += String.fromCharCode( (x<<12)
                | (URIB64.imap[w.charAt(k+1)]<<6)
                | URIB64.imap[w.charAt(k+2)] );
              k += 3;
            }
          }
          i = j + 1;
        } else { // ASCII characters not in b64
          s += URIB64.b2a[c1];
          i++;
        }
      } else {
        // NOTE: the decoder allows characters not in b64 printed verbatim
        // "~", "%", "+" and other unquoted characters will be copied
        s += c;
        i++;
      }
    }
    return s;
  }
};

if ( !URIB64.once ) URIB64.init();
//alert(URIB64.encode("+%~") + "\n" + URIB64.encode("+%~", "+%~") + "\n" + URIB64.encode("+%~", "~"));
//alert(URIB64.decode("~%+"));
//var s = "http://abc.com/test_你好! #", t = URIB64.encode(s), s2 = URIB64.decode(t);
//alert(s+"\n"+t+"\n"+s2+"\n"+(s==s2));
