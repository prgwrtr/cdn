"use strict";

var verVersion = "V0.33";

// add trim() support to IE < 9.0
if ( typeof String.prototype.trim !== 'function' ) {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
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
        cssVer = Math.round(cssVer * 100) * 0.01;
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
  var toggleButtonHTML = '<div class="version" onclick="$(\'#all-versions\').toggle(1000)"><span>版本</span></div>';
  var par = $('.version').parent();
  par.prop('id', 'all-versions');
  $( toggleButtonHTML ).insertBefore( par );
  $('#all-versions').hide(); // initially hide all version information
}

$(document).ready(function(){
  showVersions();
});
