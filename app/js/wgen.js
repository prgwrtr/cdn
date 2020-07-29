"use strict";

var wgenVersion = "V0.33";

var defVideoTitle = "介绍视频";
var defAudioTitle = "样本音乐";
var defImgTitle = "样本图片";

function modifyEdDefValues()
{
  // set the default video src
  edDefVideoSrc = "http://dmp4-web0.cdn.xldhplay.com/zhenhan/20170218.mp4";

  // set the default video poster
  edDefVideoPoster = "http://repicweb.com.zbzcdn.com/UploadFiles/2017-03-05/20173525963330.jpg";

  // set the default audio
  edDefAudioSrc = "https://gitee.com/prgcdr2/wgen/raw/master/html/audio/nmgsypsl.mp3";
  /*
  Standard versions:
    https://gitee.com/prgcdr2/wgen/raw/master/html/audio/nmgsyps.mp3
    https://i3.vzan.cc/video/livevideo/mp3/20190924/9147e275329c441997d3c4b630717930.mp3
  Lighter version:
    https://gitee.com/prgcdr2/wgen/raw/master/html/audio/nmgsypsl.mp3
    https://i3.vzan.cc/video/livevideo/mp3/20190924/70dfc6aa6cd64ea3aaddc1b44d05395b.mp3
  */
}



// append '?r=[some-random-number]' at the end of url
function coatURL(url)
{
  if ( !url ) return "";
  url = url.replace(/\s+$|^\s+/g, ''); // trim it
  if ( url.length == 0 ) return url;
  var sRand = 'r=' + Math.round(Math.random() * 100000000);
  if ( url.indexOf('?') >= 0 ) {
    url += '&' + sRand;
  } else {
    url += '?' + sRand;
  }
  return url;
}


// return the current media type, "video", "audio" or "img"
function getMediaType()
{
  return $('#media-type-display').prop("data-name");
}


// get the available media types
function getMediaTypes()
{
  return ['video', 'audio', 'img'];
}


function getMediaCategory()
{
  return $('#media-category-display').prop("data-name");
}


// return the stock media array
function getMediaArray()
{
  var cat = getMediaCategory();
  return mediaTable[cat] || [];
}


// return the index of the user-selected media item
function getMediaIndex()
{
  var nid = $('#media-id').val();
  var i = nid - 1; // the JavaScript array index is off-by-one

  var mediaArray = getMediaArray();
  var n = mediaArray.length;
  var ir = i;

  // check if the given media index `i` is out of range 0 <= i < n
  // correct it if this is so
  if ( ir < 0 ) {
    ir = 0;
  } else if ( ir >= n ) {
    ir = n;
  }

  if ( ir != i ) {
    $('#media-id').val( "" + ir );
  }

  return ir; // return the corrected index
}

function updateMediaPreview(textOnly)
{
  var mediaType = getMediaType();

  if ( mediaType === 'video' ) { // video preview
    $('#media-preview-title')
      .html( $('#input-video-title').val() );
    if ( !textOnly ) {
      $('#video-preview')
        .prop('src', coatURL($('#input-video-src').val()) )
        .prop('poster', coatURL($('#input-video-poster').val()) );
    }
    $('#media-preview-desc')
      .html( $('#input-video-desc').val() );
  } else if ( mediaType === 'audio' ) { // audio preview
    $('#media-preview-title')
      .html( $('#input-audio-title').val() );
    if ( !textOnly ) {
      $('#audio-preview')
        .prop('src', coatURL($('#input-audio-src').val()) );
    }
    $('#media-preview-desc')
      .html( $('#input-audio-desc').val() );
  } else if ( mediaType === 'img' ) { // image preview
    $('#media-preview-title')
      .html( $('#input-img-title').val() );
    if ( !textOnly ) {
      $('#img-preview')
        .prop('src', $('#input-img-src').val() )
        .prop('alt', $('#input-img-title').val() );
    }
    $('#media-preview-desc')
      .html( $('#input-img-desc').val() );
  }
}


// fill the title, url and poster information of the stock media upon selection
function updateMediaInfo()
{
  var mediaArray = getMediaArray();
  var i = getMediaIndex();
  var x = mediaArray[i];
  if ( !x ) {
    alert("media " + i + " missing");
    return;
  }

  var mediaType = getMediaType();

  // update media input fields
  if ( mediaType === 'video' )
  {
    // video
    if ( x["title"] != undefined ) {
      $('#input-video-title').val( x["title"] );
    }
    if ( x["src"] != undefined ) {
      $('#input-video-src').val( x["src"] );
    }
    if ( x["poster"] != undefined ) {
      $('#input-video-poster').val( x["poster"] );
    }
  }
  else if ( mediaType === 'audio' )
  {
    // audio
    if ( x["title"] != undefined ) {
      $('#input-audio-title').val( x["title"] );
    }
    if ( x["src"] != undefined ) {
      $('#input-audio-src').val( x["src"] );
    }
  }
  else if ( mediaType === 'img' )
  {
    // img
    if ( x["title"] != undefined ) {
      $('#input-img-title').val( x["title"] );
    }
    if ( x["src"] != undefined ) {
      $('#input-img-src').val( x["src"] );
    }
  }

  updateMediaPreview();
}


// select a media according to the user input or randomly
function selectMediaFromRange(rand)
{
  var mediaArray = getMediaArray();
  var mid = $('#media-id');
  var i, n = mediaArray.length;

  if ( rand ) { // random selection
    i = Math.floor( Math.random() * n );
    mid.val( i + 1 ); // set the input value
  }

  updateMediaInfo();
}


function showHideMediaPreviewInputItems()
{
  var mediaType = getMediaType();
  var i;

  if ( mediaType === 'video' ) {
  　$('#input-video-title').val(defVideoTitle).attr('placeholder', defVideoTitle);
    $('#input-video-src').val(edDefVideoSrc).attr('placeholder', edDefVideoSrc);
    $('#input-video-poster').val(edDefVideoPoster).attr('placeholder', edDefVideoPoster);
    $('#video-input-wrapper').show();
    $('#video-preview-wrapper').show();
  } else {
    $('#video-input-wrapper').hide();
    $('#video-preview-wrapper').hide();
  }

  if ( mediaType === 'audio' ) {
  　$('#input-audio-title').val(defAudioTitle).attr('placeholder', defAudioTitle);
    $('#input-audio-src').val(edDefAudioSrc).attr('placeholder', edDefAudioSrc);
    $('#audio-input-wrapper').show();
    $('#audio-preview-wrapper').show();
  } else {
    $('#audio-input-wrapper').hide();
    $('#audio-preview-wrapper').hide();
  }

  if ( mediaType === 'img' ) {
  　$('#input-img-title').val(defImgTitle).attr('placeholder', defImgTitle);
    $('#input-img-src').val(edDefImgSrc).attr('placeholder', edDefImgSrc);
    $('#img-input-wrapper').show();
    $('#img-preview-wrapper').show();
  } else {
    $('#img-input-wrapper').hide();
    $('#img-preview-wrapper').hide();
  }
}

// select media category, video-yg, audio-music, etc.
function selectMediaCategory(mediaCategory)
{
  var cnName = $('#' + mediaCategory).html();
  $('#media-category-display').html( cnName ).prop("data-name", mediaCategory);

  // update preview and input elements to be shown or hidden
  showHideMediaPreviewInputItems();

  // update the range of selection
  var mediaArray = getMediaArray();
  if ( mediaArray.length > 0 ) {
    $('#media-ranger').show();
    var mediaMax = "" + mediaArray.length;
    $('#media-id').prop("min", "1").prop('max', mediaMax);
    $('.media-max').html(mediaMax);
    selectMediaFromRange(true); // randomly choose a video in this category

    // hide the input pad
    $('#media-input').hide();
    BSW.chooseById('show-media-input');
  } else {
    $('#media-ranger').hide();
    // no stock array, the default will be used for preview
    updateMediaPreview();

    // if no stock array show the input pad
    $('#media-input').show();
    BSW.chooseById('hide-media-input');
  }
}


function selectMediaType(mediaType)
{
  // update the current media type
  var cnTypeName = $('#media-type-' + mediaType).html();
  $('#media-type-display').html( cnTypeName ).prop("data-name", mediaType);
  $('.media-type-name').html( cnTypeName );

  // update the available options
  var firstCategory = null;
  $('#media-category a').each(function(i, el) {
    var cls = $(this).prop('class');
    if ( cls.substring(0, mediaType.length) == mediaType ) {
      if ( !firstCategory ) {
        firstCategory = $(this).prop("id");
      }
      $(this).show();
    } else {
      $(this).hide();
    }
  });
  // update the category
  selectMediaCategory(firstCategory);
}


function toggleMediaInput()
{
  $('#media-input').toggle(1000);
}



function needQRCode()
{
  return BSW.isOn('use-qr');
}

function updateQRPreview()
{
  $('#qr-preview').prop('src', coatURL($('#qr-src').val()));
}

function showHideQRInput_(focus)
{
  var blk = $('#qr-block');
  if ( needQRCode() ) {
    blk.show();
    updateQRPreview();
    if ( focus ) {
      $('#qr-src').focus();
    }
  } else {
    blk.hide();
  }
}

function showHideQRInput()
{
  showHideQRInput_(true);
}


// media header (apology message for the loading the media)
var mediaHeader = '<p style="text-align:center;font-size:80%;margin:10px 0px 5px 0px">{media-header}</p>\n';

var videoTemplate = ''
  + '<section>\n<p style="text-align:center;color:{caption-color};font-size:20px;font-weight:bold;margin-top:10px;margin-bottom:10px">{video-title}</p>\n'
  + '<p style="text-align:center;margin-bottom:10px">\n'
  + '<video src="{video-src}" poster="{video-poster}" preload="none" controls="controls" loop="loop" webkit-playsinline="" playsinline="" style="width:800px;max-width:100%">'
  + '</video>\n</p>\n'
  + '<p style="text-align:center;margin-bottom:10px">{video-desc}</p>\n</section>\n';

var audioTemplate = ''
  + '<section>\n<p style="text-align:center;color:{caption-color};font-size:20px;font-weight:bold;margin-top:10px;margin-bottom:10px">{audio-title}</p>\n'
  + '<p style="text-align:center;margin-bottom:10px">\n'
  + '<audio src="{audio-src}" preload="none" controls="controls" style="width:100%"></audio>\n</p>\n'
  + '<p style="text-align:center;margin-bottom:10px">{audio-desc}</p>\n</section>\n';

var imgTemplate = ''
  + '<section>\n<p style="text-align:center;color:{caption-color};font-size:20px;font-weight:bold;margin-top:10px;margin-bottom:10px">{img-title}</p>\n'
  + '<p style="text-align:center;margin-bottom:10px">\n'
  + '<img src="{img-src}" alt="{img-title}" style="max-width:100%">\n</p>\n'
  + '<p style="text-align:center;margin-bottom:10px">{img-desc}</p>\n</section>\n';

var shareMsg = '<p style="text-align:center;font-size:128%;color:{caption-color};border-bottom:1px dotted #aaaaaa;margin:5px 0px 10px 0px;padding:5px 0px 15px 0px">{share-msg}</p>\n';

var qrHeader = '<p style="text-align:center;margin-bottom:10px;font-size:80%">{qr-header}</p>';
var qrBodyTemplate = '<p style="text-align:center"><img src="{qr-src}" style="width:800px;max-width:100%"></p>';

var apologyMsg = '<p style="text-align:center;color:#888888;font-size:80%">{apology-msg}</p>';

function generateHTML() {
  var s = '', sm = '', title, mediaType = getMediaType();

  if ( mediaType === 'video' )
  {
    // set the media header (apology message)
    sm += mediaHeader.replace(/\{media\-header\}/g, $('#video-input-header').val());

    sm += videoTemplate;
    sm = sm.replace(/\{video\-title\}/g, $('#input-video-title').val());
    sm = sm.replace(/\{video\-src\}/g, coatURL( $('#input-video-src').val() ) );
    sm = sm.replace(/\{video\-poster\}/g, coatURL( $('#input-video-poster').val() ) );
    sm = sm.replace(/\{video\-desc\}/g, $('#input-video-desc').val());
  }
  else if ( mediaType === 'audio' )
  {
    // set the media header (apology message)
    sm += mediaHeader.replace(/\{media\-header\}/g, $('#audio-input-header').val());

    sm += audioTemplate;
    sm = sm.replace(/\{audio\-title\}/g, $('#input-audio-title').val());
    sm = sm.replace(/\{audio\-src\}/g, coatURL( $('#input-audio-src').val() ) );
    sm = sm.replace(/\{audio\-desc\}/g, $('#input-audio-desc').val());
  }
  else if ( mediaType === 'img' )
  {
    sm += imgTemplate;
    sm = sm.replace(/\{img\-title\}/g, $('#input-img-title').val() );
    sm = sm.replace(/\{img\-src\}/g, coatURL( $('#input-img-src').val() ) );
    sm = sm.replace(/\{img\-desc\}/g, $('#input-img-desc').val());
  }
  s += sm;

  // add the main text
  var txt = $('#main-text').html().replace(/\s+$/g, '');
  if ( txt.length > 0 ) {
    //s += '<hr style="border-top:1px solid #aaaaaa;margin:30px 15% 20px 15%">\n';
    s += '<div style="font-size:18px;background-color:#fffff0;text-align:left;line-height:1.5;padding:1.5em 1em 1.5em 1em;margin:10px 5px 20px 5px">' + txt + '</div>';
  }

  // add a message: welcome to share this post
  s += shareMsg.replace(/{share\-msg}/g, $('#share-msg').val());

  if ( needQRCode() ) {
    var qrSrc = $('#qr-src').val();
    if ( qrSrc.length > 0 ) {
      s += qrHeader.replace(/\{qr\-header\}/g, $('#qr-header').val());
      var sQr = qrBodyTemplate;
      qrSrc = coatURL(qrSrc);
      sQr = sQr.replace(/\{qr\-src\}/g, qrSrc);
      s += sQr;
    }
  }

  // add a message: we apologize for mistakes in this post
  s += apologyMsg.replace(/\{apology\-msg\}/g, $('#apology-msg').val());

  // replace the caption color
  //alert($('#caption-color').val());
  s = s.replace(/\{caption\-color\}/g, $('#caption-color').val());

  setEditorContent(s);
  //setEditorMode('vis'); // switch to visual mode
}

function toggleAdvancedOptions()
{
  $('.advanced-option').toggle(1000);
}


function toggleEditorToolbar()
{
  var isVis = $('#bottom-toolbar-wrapper').toggle().is(':visible');

  if ( isVis ) {
    gotoEditorTop();
  }
}

// the editor code is copied directly from ed.html
// here we do some adjustments so it better fits here without causing too much distraction
function adjustEditorTools()
{
  // tune down the appearance of the editors
  $('#copy-all-button').removeClass('btn-block btn-lg').addClass('btn-default');
  // place all buttons below the editor
  $('#editor-toolbar').removeClass('col-sm-12').css('display', 'inline').insertBefore('#copy-all-button');
  $('#bottom-toolbar-wrapper').hide();
  $('#editing-tip').insertAfter('#ios-warning');
  // turn drop down to drop up
  $('.ed-btn-group-dropdown').addClass('dropup');
  $('#ios-warning').insertBefore('#html-editor');
}


function generateAndCopy()
{
  generateHTML();
  copyAll();
}

$(document).ready(function () {
  // hide advanced options
  $('.advanced-option').hide();

  // initialize default values for input
  modifyEdDefValues();

  selectMediaType('video');

  // initialize the switch for using the QR code
  // but do not set focus
  showHideQRInput_(false);

  // adjust the toolbar placement, etc. for the editor
  adjustEditorTools();

  // move to the top of the page
  $('html, body').animate({scrollTop:(0)}, 1000);
});
