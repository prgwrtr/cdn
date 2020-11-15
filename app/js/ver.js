"use strict";

var verVersion = "V0.35";

// add trim() support to IE < 9.0
if ( typeof String.prototype.trim !== 'function' ) {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  }
}

// respond user click
function toggleVersions()
{
  var ver = $('.all-versions');
  if ( ver.is(':visible') ) {
    ver.slideUp(500);
  } else {
    ver.slideDown(500);
    setTimeout( function() {
      $('.all-versions')[0].scrollIntoView({behaviro:"smooth", block: "end", inline: "nearest"})
    }, 500);
  }
}

// add CSS and Javascript versions
function showVersions()
{
  $('.version').each(  function(index) {
    if ( $(this).html().trim() !== "" ) {
      return; // already generated
    }

    var html = '', htmlHeader = '<span>' + $(this).attr('data-name').trim() + ' ';

    if ( index == 0 ) {
      // get the HTML version
      var htmlVer = $('meta[name="version"]').attr("content");
      if ( !htmlVer ) htmlVer = 'V1.0';
      html += htmlVer;
    }

    // get CSS version
    var cssFilename = $(this).attr('data-css');
    if ( cssFilename ) {
      var cssPath = 'css/' + cssFilename; // TODO: search head to get the true path
      var cssVer = $(this).css('letter-spacing');
      if ( cssVer ) {
        if ( html.length > 0 ) html += ', ';
        // remove letters in the version
        cssVer = cssVer.replace(/[a-z]+/gi, '');
        cssVer = Math.round(cssVer * 100) / 100;
        cssVer = 'V' + cssVer;
        html += '<a href="' + cssPath + '">' + cssFilename + '</a> ' + cssVer;
      }
    }

    // JavaScript version saved as a global variable
    var jsFilename = $(this).attr('data-js');
    if ( jsFilename ) {
      var jsPath = 'js/' + jsFilename; // TODO: search head to get the true path
      var jsVar = $(this).attr('data-js-var'); // get the variable name
      if ( window[jsVar] ) {
        if ( html.length > 0 ) html += ', ';
        html += '<a href="' + jsPath + '">' + jsFilename + '</a> ' + window[jsVar];
      }
    }
    html += '</span>';

    html = htmlHeader + html;
    $(this).html( html );
  });

  // insert a controlling div before the version group
  var toggleButtonHTML = '<div class="version-btn" onclick="toggleVersions()"><span>版本</span></div>';
  var par = $('.version').parent();
  par.addClass('all-versions');
  $( toggleButtonHTML ).insertBefore( par );
  $('.all-versions').hide(); // initially hide all version information
}

$(document).ready(function(){
  showVersions();
});
