"use strict";

var edVersion = "V0.33";

//var edDefAudioSrc = "https://i3.vzan.cc/video/livevideo/mp3/20190924/70dfc6aa6cd64ea3aaddc1b44d05395b.mp3"; // namo guan-shi-yin pu-sa
//var edDefAudioSrc = "https://i3.vzan.cc/upload/audio/mp3/20200220/249eee1e46cc46a5864131acf136053c.mp3"; // water-moon-zen-heart
var edDefAudioSrc = "https://i3.vzan.cc/upload/audio/mp3/20200614/d1c2588412784fa7a2baf8b73242c99a.mp3"; // water-moon-zen-heart 17s exerpt
var edDefVideoSrc = "https://i3.vzan.cc/upload/video/mp4/20200614/82a09afb5f0548c7a0de4d8d1fd36a65.mp4"; // fyfy 4
var edDefVideoPoster = "https://i2.vzan.cc/upload/image/jpg/20200614/77e2f7393bde43238cf3304338446ce5.jpg"; // fyfy 4
//var edDefVideoSrc = "https://i3.vzan.cc/video/livevideo/mp4/20190927/ae344d4e437d46389ba0d7df5bc91179.mp4"; // big rabbit
//var edDefVideoPoster = "https://i.postimg.cc/28cBJpkx/sampleposter.png"; // big rabbit
var edDefImgSrc = "https://i.postimg.cc/Kj5t4RyX/lotus1.jpg";
var edDefQRImgSrc = "https://i.postimg.cc/hPxHZnbk/edqr.png";
/*
var edDefAudioSrc = "https://gitee.com/prgcdr2/wgen/raw/master/html/audio/nmgsypsbgl.mp3";
var edDefVideoSrc = "https://gitee.com/prgcdr2/qr/blob/master/img/samplevideo.mp4";
var edDefVideoPoster = "https://gitee.com/prgcdr2/qr/raw/master/img/sampleposter.png";
var edDefImgSrc = "https://gitee.com/prgcdr2/wgen/raw/master/html/img/lotus1.jpg";
var edDefQRImgSrc = "https://gitee.com/prgcdr2/qr/raw/master/img/edqr.png";
*/

// selection range of the editor as a global variable
var visEdSelRange = null;


// replace glyphicon
function subGlyphicons(s)
{
  return s.replace(/\[\[([\w-]+)\]\]/g, '<span class="glyphicon glyphicon-$1">');
}
/*
  $('input[type="checkbox"][data-toggle="toggle"]').each(function(){
    $(this).attr('data-on', subGlyphicons( $(this).attr('data-on') ) );
    $(this).attr('data-off', subGlyphicons( $(this).attr('data-off') ) );
  });
*/

// return the current editor mode, 'vis' or 'src'
function getEditorMode()
{
  if ( BSW.isOn('editor-mode-sel') ) {
    return 'vis';
  } else {
    return 'src';
  }
}


// focus the current editor, return the current editor mode, 'vis' or 'src'
function focusEditor()
{
  var mode = getEditorMode();
  document.getElementById(mode + '-editor').focus();
  return mode;
}


function gotoEditorTop()
{

  var mode = focusEditor();
  var edId = mode + '-editor';
  var ed = document.getElementById(edId);

  try {
    var sel = window.getSelection();
    var range = sel.getRangeAt(0);
    range.setStart(ed, 0);
    range.setEnd(ed, 0);
    sel.removeAllRanges();
    sel.addRange(range);
  } catch(e) {}
}

// check if the editor contains anything significant
function isEditorDirty()
{
  var mode = getEditorMode(), val;
  if ( mode == 'vis' ) {
    val = $('#vis-editor').html();
  } else {
    val = $('#src-editor').val();
  }
  return val.trim() !== '';
}


// update control appearances according to the editor mode 'mode'
function showHideEditor(mode)
{
  var visEditor = $('#vis-editor-wrapper');
  var srcEditor = $('#src-editor-wrapper');
  if ( mode == 'vis' ) {
    srcEditor.hide();
    visEditor.show();
    $('#vis-editor').focus();
  } else {
    visEditor.hide();
    srcEditor.show();
    $('#src-editor').focus();
  }
}

function setEditorContent(s)
{
  // to prevent future calls to convertEditorContent, explicit or implicit
  // we set the contents of both the visual and the source-code editors
  $('#vis-editor').html(s);
  $('#src-editor').val(s);
}

function convertEditorContent(dstMode)
{
  // content conversion
  var visEditor = $('#vis-editor');
  var srcEditor = $('#src-editor');
  if ( dstMode == 'src' ) { // from visual mode to source-code mode
    srcEditor.val( visEditor.html() );
    srcEditor.focus();
  } else { // from source-code mode to visual mode
    visEditor.html( srcEditor.val() );
    visEditor.focus();
  }
}


// toggle editor mode to 'mode'
function clickEditorMode(e, changed)
{
  if ( !changed )
    return;

  var mode = getEditorMode();
  // update control appearances according to the new mode
  showHideEditor(mode);
  convertEditorContent(mode);
}


// manually set the editor mode to 'mode'
// also toggle the editor-mode button if necessary
function setEditorMode(mode)
{
  var oldMode = getEditorMode(); // get current mode by reading the editor button

  if ( mode !== oldMode ) {
    // act as if clicking the mode selection button
    BSW.userToggle('editor-mode-sel');
  } else {
    // ideally, nothing needs to be done if the mode hasn't been changed
    // but editor mode might be messed up because of the browser's cache
    // so we force it to show the right editor
    showHideEditor(mode);
    // do we need to call convertEditorContent()?
  }
}


// update control appearances according to the editor mode 'mode'
function showHideFormatTools()
{
  var tools = $('#format-tools');
  if ( BSW.isOn('toggle-format-tools') ) {
    tools.show();
  } else {
    tools.hide();
  }
}


function saveSelection()
{
  var range = null;
  if ( window.getSelection ) {
    var sel = window.getSelection();
    if ( sel.getRangeAt && sel.rangeCount > 0 ) {
      range = sel.getRangeAt(0);
    }
  } else if ( document.selection && document.selection.createRange ) {
    range = document.selection.createRange();
  }
  return range;
}

function restoreSelection(range)
{
  if ( range ) {
    if ( window.getSelection ) {
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange( range );
    } else if (document.selection && range.select) {
      range.select();
    }
  }
}


function buildSelectionSaver()
{
  $('#vis-editor').blur(function(e){
    visEdSelRange = saveSelection();
  });
  $('#vis-editor').focus(function(e){
    restoreSelection( visEdSelRange );
  });
}


function insertHTMLCode(insStart, insEnd)
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    try {
      document.execCommand("insertHTML", false, insStart);
    } catch(e) {}
  } else {
    insertText('src-editor', insStart, insEnd);
  }
}


function makeBold()
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('bold');
  } else {
    insertHTMLCode('<span style="font-weight:bold">', '</span>');
  }
}


function makeItalic()
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('italic');
  } else {
    insertHTMLCode('<span style="font-style:italic">', '</span>');
  }
}


function makeUnderline()
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('underline');
  } else {
    insertHTMLCode('<span style="text-decoration:underline">', '</span>');
  }
}


function makeStrikeThrough()
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('strikethrough');
  } else {
    insertHTMLCode('<span style="text-decoration:line-through">', '</span>');
  }
}


function setFontSize(size)
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('fontSize', false, size);
  } else {
    var sizeTable = {
      "1": "xx-small",
      "2": "x-small",
      "3": "small",
      "4": "medium",
      "5": "large",
      "6": "x-large",
      "7": "xx-large",
    };
    var sSize = sizeTable[size];

    insertHTMLCode('<span style="font-size:' + sSize + '">', '</span>');
  }
}


function setTextColor(color)
{
  var edMode = focusEditor();
  if ( !color ) {
    color = prompt('输入文字颜色代码', '#ff0000');
    if ( color == null ) return;
  }
  if ( edMode == 'vis' ) {
    document.execCommand('foreColor', false, color);
  } else {
    insertHTMLCode('<span style="color:' + color + '">', '</span>');
  }
}


function setBackgroundColor(color)
{
  var edMode = focusEditor();
  if ( !color ) {
    color = prompt('输入背景颜色代码', '#ffff00');
    if ( color == null ) return;
  }
  if ( edMode == 'vis' ) {
    document.execCommand('backColor', false, color);
  } else {
    insertHTMLCode('<span style="background-color:' + color + '">', '</span>');
  }
}


function setSuperscript(size)
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('superscript');
  } else {
    insertHTMLCode('<sup>', '</sup>');
  }
}


function setSubscript(size)
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('subscript');
  } else {
    insertHTMLCode('<sub>', '</sub>');
  }
}

function removeFormat()
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('removeFormat');
  } else {
    // s = s.replace(/(<([^>]+)>)/ig, "");
  }
}


function alignLeft()
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('justifyLeft');
  } else {
    insertHTMLCode('<div style="text-align:left">', '</div>');
  }
}


function alignCenter()
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('justifyCenter');
  } else {
    insertHTMLCode('<div style="text-align:center">', '</div>');
  }
}


function alignRight()
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('justifyRight');
  } else {
    insertHTMLCode('<div style="text-align:right">', '</div>');
  }
}


function alignJustify()
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('justifyFull');
  } else {
    insertHTMLCode('<div style="text-align:justify">', '</div>');
  }
}

function indent()
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('indent');
  } else {
    insertHTMLCode('\n<div style="margin-left:4em;">', '</div>\n');
  }
}

function outdent()
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('outdent');
  } else {
    insertHTMLCode('\n<div style="margin-left:-4em;">', '</div>\n');
  }
}

function insertParagraph()
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('insertParagraph');
  } else {
    insertHTMLCode('\n<p>', '</p>\n');
  }
}

function insertUnorderedList()
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('insertUnorderedList');
  } else {
    insertHTMLCode('\n<ul>\n  <li></li>\n  <li></li>\n  <li></li>\n</ul>\n', '');
  }
}


function insertOrderedList()
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    document.execCommand('insertOrderedList');
  } else {
    insertHTMLCode('\n<ol>\n  <li></li>\n  <li></li>\n  <li></li>\n</ol>\n', '');
  }
}

function setCaretPosition(elemId, caretPos)
{
  var elem = document.getElementById(elemId);
  if ( !elem ) return;
  elem.focus();

  if ( elem.setSelectionRange ) {
    elem.setSelectionRange(caretPos, caretPos);
  } else {
    try {
      el.selectionStart = caretPos;
      el.SelectionEnd = caretPos;
    } catch (err) {
      if ( elem.createTextRange ) {
        var range = elem.createTextRange();
        range.move('character', caretPos);
        range.select();
      }
    }
  }
}


// set the start and end position of an <input> or <textarea>
// for IE version > 9
function setSelPos(elemId, selStart, selEnd)
{
  if ( !selEnd ) selEnd = selStart;

  var elem = document.getElementById(elemId);
  if ( !elem ) return;

  if ( elem.setSelectionRange ) {
    elem.focus();
    elem.setSelectionRange(selStart, selEnd);
  }
}


function subKeys(template, tab)
{
  var s, k, re;
  s = template;
  for ( k in tab ) {
    if ( tab.hasOwnProperty(k) ) {
      re = new RegExp("{" + k + "}", 'gi');
      s = s.replace(re, tab[k]);
    }
  }
  return s;
}


// make insertion to the HTML code
// insert insStart at the beginning of selection
// insert insEnd at the end of selection (if any)
function insertText(elemId, insStart, insEnd)
{
  var ed = document.getElementById(elemId);
  if ( !insStart ) insStart = "";
  if ( !insEnd ) insEnd = "";

  ed.focus(); // focus on the editor
  // ed.selectionStart is defined only for a textarea
  if ( ed.selectionStart !== undefined ) { // modern browsers
    var start = ed.selectionStart;
    var end = ed.selectionEnd;
    var txt = ed.value;
    var s1 = txt.substring(0, start);
    var s2 = txt.substring(start, end);
    var s3 = txt.substring(end);

    var ntxt = s1 + insStart + s2 + insEnd + s3;
    ed.value = ntxt;
    setCaretPosition(elemId, end + insStart.length + insEnd.length);
    //console.log("after insersion", ed.selectionStart, ed.selectionEnd);
    //setSelPos(elemId, start, end + insStart.length + insEnd.length);
  } else { // IE version < 9
    var rang = document.selection.createRange();
    // var par = rang.parentElement(); // par == ed;
    rang.text = insStart + rang.text + insEnd;
  }
}

function getSelText(elemId)
{
  var obj = document.getElementById(elemId);
  var selText;

  // http://www.codetoad.com/javascript_get_selected_text.html
  if ( obj.selectionStart !== undefined ) { // Standards Compliant Version
    var startPos = obj.selectionStart;
    var endPos = obj.selectionEnd;
    selText = obj.value.substring(startPos, endPos);
  } else {
    obj.focus();
    if ( window.getSelection ) {
      selText = window.getSelection() + "";
    } else if ( document.getSlection ) {
      selText = document.getSelection() + "";
    } else if ( document.selection !== undefined ) { // IE Version
      var sel = document.selection.createRange();
      selText = sel.text;
    }
  }

  return selText;
}

function insertImage()
{
  var url = prompt("输入图片网址", edDefImgSrc);
  if ( url == null ) return;
  var s = '<section><p style="text-align:center;margin:5px 0px">\n'
    + '  <img src="' + url + '" style="max-width:90%">\n'
    + '</p></section>\n<p><br></p>\n\n';
  insertHTMLCode(s);
}


function insertQRCode()
{
  var url = prompt("输入二维码图片网址", edDefQRImgSrc);
  if ( url == null ) return;
  var s = '<section><p style="text-align:center;font-size:80%;margin-top:10px">更多信息，请扫下图中的二维码</p>\n'
    + '<p style="text-align:center;margin:5px 0px">\n'
    + '  <img src="' + url + '" style="max-width:90%">\n'
    + '</p></section>\n<p><br></p>\n\n';
  insertHTMLCode(s);
}


function insertAudio()
{
  var url = prompt("输入音频网址", edDefAudioSrc);
  if ( url == null ) return;
  var template = '<section><p style="font-size:20px;font-weight:bold;margin-bottom:20px;text-align:center">【〔音频〕标题】</p>\n<p style="margin-bottom:30px"><audio src="{src}" controls="" style="width:100%"></audio></p></section>\n<p><br></p>\n\n';
  var s = subKeys(template, {"src": url});
  insertHTMLCode(s);
}


function insertVideo()
{
  var src = prompt("输入视频网址", edDefVideoSrc);
  if ( src == null ) return;
  var poster = prompt("输入封面网址", edDefVideoPoster);
  if ( poster == null ) return;
  var template = '<section><p style="font-size:20px;font-weight:bold;margin-bottom:20px;text-align:center">【〔视频〕标题】</p><p style="margin-bottom:30px;text-align:center"><video src="{src}" poster="{poster}" controls="controls" preload="none" loop="loop" webkit-playsinline="" playsinline="" style="width:800px;max-width:100%;"></video></p></section>\n<p><br></p>\n\n';
  var s = subKeys(template, {"src": src, "poster": poster});
  insertHTMLCode(s);
}

function createLink()
{
  var url = prompt("输入网址");
  if ( url == null ) return;

  var htmlBegin = '\n<a href="' + url + '" target="_blank" rel="noopener noreferrer">';
  var htmlEnd = '</a>\n';
  var htmlBody = url;

  var edMode = focusEditor(), s;
  if ( edMode == 'vis' ) {
    s = getSelText('vis-editor');
    if ( s === "" ) {
      insertHTMLCode(htmlBegin + htmlBody + htmlEnd);
    } else {
      document.execCommand('createLink', false, url);
    }
  } else {
    s = getSelText('src-editor');
    if ( s === "" ) {
      insertHTMLCode(htmlBegin + htmlBody + htmlEnd);
    } else {
      insertHTMLCode(htmlBegin, htmlEnd);
    }
  }
}

function undo()
{
  focusEditor();
  document.execCommand('undo');
}


function redo()
{
  focusEditor();
  document.execCommand('redo');
}


function getMSIEVersion()
{
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");

  if (msie > 0 || !!ua.match(/Trident.*rv\:11\./)) { // If Internet Explorer, return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
  }

  return 0;
}

function copyAll()
{
  var mode = focusEditor();
  var edId = mode + '-editor';
  var ed = document.getElementById(edId);
  var isIOS = navigator.userAgent.match(/ipad|ipod|iphone/i);
  var ieVer = getMSIEVersion();
  var range, sel;

  // References:
  // Copy everything in the content editable div
  // [1] https://stackoverflow.com/questions/6139107/programmatically-select-text-in-a-contenteditable-html-element
  // [2] https://stackoverflow.com/questions/12243898/how-to-select-all-text-in-contenteditable-div
  // Copy
  // [3] https://stackoverflow.com/questions/34045777/copy-to-clipboard-using-javascript-in-ios

  // select everything
  if ( isIOS ) { // iPhone, iPad, Mac
    // even for textarea, ed.select() won't work for iOS, see ref[3]
    ed.readOnly = true; // avoid iOs keyboard opening
    range = document.createRange();
    range.selectNodeContents(ed);
    sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    try {
      ed.setSelectionRange(0, 99999999);
    } catch (err) { // in case setSelectionRange() doesn't exist
      try {
        document.execCommand('selectAll');
      } catch (err2) {}
    }
    ed.readOnly = false;
  } else if ( ieVer > 0 ) { // is MSIE
    if ( document.createRange && window.selection ) {
      range = document.createRange();
      range.selectNodeContents(ed);
      sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if ( document.body.createTextRange ) {
      range = document.body.createTextRange();
      range.moveToElementText(ed);
      range.select();
    }
  } else { // other modern browsers
    if ( mode == "vis" ) {
      document.execCommand('selectAll');
    } else {
      ed.select();
    }
  }

  try {
    // system copy command
    document.execCommand('copy');
  } catch (e) {}

  if ( isIOS ) {
    $('#ios-warning').show();
  }
}


function iOSPrepare()
{
  $('#ios-warning').hide();
}


function leavePageWarning()
{
  $(window).on('beforeunload', function(e){
    if ( isEditorDirty() ) {
      e.preventDefault();
      e.returnValue = '';
      return '您做的编辑会丢失，真的要离开吗？'; // for older browsers
    }
  });
}

// prevent the visual editor from losing focus when the user clicks a pseudo button
function keepEditorFocused()
{
  $('.pseudo-button').bind('mousedown', function(e) {
    e.preventDefault();
  });
}

$(document).ready(function () {
  showHideEditor('vis');

  showHideFormatTools(); // must come after the BSW is created

  iOSPrepare();
  buildSelectionSaver(); // initialize selection restoration for visual editor
  focusEditor();
  keepEditorFocused();
  leavePageWarning();
});
