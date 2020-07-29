"use strict";

function a2html(s)
{
  var tab = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '\n': '<br>'
  };
  var c = tab[s];
  return ( c != undefined ) ? c : s;
}

function showSpaceHTML(s, showAll)
{
  var i, t = "";
  for ( i = 0; i < s.length; i++ ) {
    var c = s.charAt(i);
    var r = c.charCodeAt(0);

    // determine if the character is a letter
    // https://en.wikipedia.org/wiki/Unicode_block
    var type = 0;
    if ( c === ' ' ) {  // plain space
      type = 1;
    } else if ( ( r >= 0x2000 && r <= 0x205f )
             || ( r >= 0x0300 && r <= 0x03ff )
             || ( r == 0xfeff ) ) {
      // https://en.wikipedia.org/wiki/General_Punctuation
      type = 2;
    } else if ( ( r >= 32 && r <= 127 ) ) {
      type = 0;
    } else {
      type = -1;
    }

    if ( type === -1 ) {
      if ( showAll ) {
        type = 2;
      } else {
        type = 0;
      }
    }

    if ( type === 0 ) {
      t += a2html(c);
    } else if ( type === 1 ) {
      t += '<span class="sp">' + c + '</span>';
    } else {
      t += c + '<span class="sp">&amp;#x' + r.toString(16) + ';</span>'
    }
  }
  return t;
}

function showSpace()
{
  var s = $('#src-editor').val();
  var showAll = $('#show-all').is(':checked');
  s = showSpaceHTML(s, showAll);
  $('#sp-display').html(s);
}

$(document).ready(function () {
  var s='U+2000：你&#x2000;好&#x2000;!\n';
  s+='U+2001：你&#x2001;好&#x2001;!\n';
  s+='U+2002：你&#x2002;好&#x2002;!\n';
  s+='U+2003：你&#x2003;好&#x2003;!\n';
  s+='U+2004：你&#x2004;好&#x2004;!\n';
  s+='U+2005：你&#x2005;好&#x2005;!\n';
  s+='U+2006：你&#x2006;好&#x2006;!\n';
  s+='U+2007：你&#x2007;好&#x2007;!\n';
  s+='U+2008：你&#x2008;好&#x2008;!\n';
  s+='U+2009：你&#x2009;好&#x2009;!\n';
  s+='U+200a：你&#x200a;好&#x200a;!\n';
  s+='U+200b：你&#x200b;好&#x200b;!\n';
  s+='U+200c：你&#x200c;好&#x200c;!\n';
  s+='U+200d：你&#x200d;好&#x200d;!\n';
  s+='U+200e：你&#x200e;好&#x200e;!\n';
  s+='U+200f：你&#x200f;好&#x200f;!\n';
  s+='U+00A0：你&#x180e;好&#x180e;!\n';
  s+='你&#x0307;好\n';
  s+='你&#x034F;好\n';
  s+='你&#x0358;好\n';
  s+='你&#x0323;好\n';
  s+='你&#x205f;好\n';
  s+='你&#x0387;好·好\n';
  s+='你&#x037a;好&#183;你&#903;好&#1468;你&#712;好&#xfeff;你&#729;好\n';
  s = s.replace(/\n/g, '<br>');
  $('#dummy-div').html(s);
  s = $('#dummy-div').html();
  s = s.replace(/<br>/g, '\n');
  $('#src-editor').val(s);
  //$('#sp-display').html(s);
});

