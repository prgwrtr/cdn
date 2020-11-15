"use strict";

var edVersion = "V0.36";

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
  var tools = $('.format-tool');
  if ( BSW.isOn('toggle-format-tools') ) {
    tools.show(700);
  } else {
    tools.hide(700);
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

// insert HTML at the current position
function insertHTMLCode2(html)
{
  var edMode = focusEditor();
  if ( edMode == 'vis' ) {
    var sel = window.getSelection();
    var range = sel.getRangeAt(0);
    var range2 = document.createRange(), frag;
    if ( range2.createContextualFragment ) {
      frag = range2.createContextualFragment( html );
      //console.log("fragment created by createContextualFragment()");
    } else {
      // https://stackoverflow.com/a/25214113
      var temp = document.createElement("template");
      temp.innerHTML = html;
      frag = temp.content;
      if ( !frag ) {
        frag = document.createElement("DIV");
        frag.innerHTML = html;
      }
    }
    range.insertNode(frag);
    if ( sel.collapseToEnd ) {
      sel.collapseToEnd();
    } else {
      sel.collapse();
    }
  } else {
    insertText('src-editor', insStart);
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

function insertSeparator()
{
  focusEditor();
  insertHTMLCode2('\n<hr style="margin:1em 0">\n');
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

// deprecated
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

function autoToggleEditorModeAlert()
{
  var mode = getEditorMode();
  if ( mode === "vis" ) {
    $('.edmode-alert').text('为精确定位插入点和更好地保持格式，请尽量切换到源代码编辑模式，选择源代码插入点后，再插入代码').show();
    //$('.edmode-alert').text('为精确定位插入点和更好地保持格式，请尽量切换到源代码编辑模式，选择源代码插入点后，再插入代码；否则代码会插入在最后').show();
  } else {
    $('.edmode-alert').hide();
  }
}

// find the options-wrapper modal in this element and its parents
function findParentModal(el)
{
  return $(el).closest('.modal.options-wrapper');
}

function toggleModalAdvancedOptions(e, changed)
{
  var modal = findParentModal(e.target);
  modal.find('.advanced').toggle(500);
}

function collectSnippetInfo(modal)
{
  var type = modal.data("type"), info;
  if ( type === "image" ) {
    info = collectImageInfo();
  } else if ( type === "qrcode" ) {
    info = collectQRCodeInfo();
  } else if ( type === "audio" ) {
    info = collectAudioInfo();
  } else if ( type === "video" ) {
    info = collectVideoInfo();
  } else if ( type === "link" ) {
    info = collectLinkInfo();
  } else {
    console.log("Error: unknown type", type);
    info = {"type": type};
  }
  return info;
}

function renderSnippet(info)
{
  var code;
  if ( info.type === "link" ) {
    code = renderLink(info);
  } else {
    code = MediaCom.render(info);
  }
  return code;
}

function updatePreviewer(el, timeout)
{
  if ( timeout === undefined ) {
    timeout = 0;
  }
  // if this is called from #image-link-images
  // the animation requires some time to show or hide elements
  // info will be affected by if link-options is visible or not
  // so we wait for a while be before updating
  setTimeout( function() {
    var modal = findParentModal(el);
    var info = collectSnippetInfo(modal);
    var code = renderSnippet(info);
    modal.find('.previewer').html(code);
    modal.find('.src-code').html(code);
  }, timeout );
}

// insert the snippet into the editor
function insertSnippet(el)
{
  var modal = findParentModal(el);
  var info = collectSnippetInfo(modal), code;
  info["inc-id"] = true;
  var code = renderSnippet(info);
  modal.modal('hide');
  insertHTMLCode2(code);
}

// copy the source code of the snippet into the clipboard
function copySnippet(btn)
{
  var modal = findParentModal(btn);
  txt = modal.find(".src-code")[0];
  copyContentToClipboard(txt, btn);
  // fade out the html div, then fade it back in
  animateShow(txt, [1.0, 700, 0.3, 600, 0.3, 700, 1.0]);
}

function collectImageInfo()
{
  var info = {"type": "image"};
  info["title"] = $('#image-title').val();
  info["src"] = $('#image-src').val();
  info["style"] = $('#image-style').val();
  info["descr"] = $('#image-descr').val();
  if ( $('#image-link-options').hasClass('in') ) {
    info["href"] = $('#image-link-href').val();
    info["open-in-new-page"] = $('#image-link-open-in-new-page').is(':checked');
  }
  return info;
}

function collectQRCodeInfo()
{
  var info = {"type": "image"};
  info["title"] = $('#qrcode-title').val();
  info["src"] = $('#qrcode-src').val();
  info["style"] = $('#qrcode-style').val();
  info["descr"] = $('#qrcode-descr').val();
  info["href"] = $('#qrcode-link-href').val();
  info["open-in-new-page"] = $('#qrcode-link-open-in-new-page').is(':checked');
  return info;
}

function collectAudioInfo()
{
  var info = {"type": "audio"};
  info["title"] = $('#audio-title').val();
  info["src"] = $('#audio-src').val();
  info["style"] = $('#audio-style').val();
  info["descr"] = $('#audio-descr').val();
  info["loop"] = $('#audio-loop').is(':checked');
  info["autoplay"] = $('#audio-autoplay').is(':checked');
  return info;
}

function collectVideoInfo()
{
  var info = {"type": "video"};
  info["title"] = $('#video-title').val();
  info["src"] = $('#video-src').val();
  info["poster"] = $('#video-poster').val();
  info["style"] = $('#video-style').val();
  info["descr"] = $('#video-descr').val();
  info["loop"] = $('#video-loop').is(':checked');
  info["autoplay"] = $('#video-autoplay').is(':checked');
  return info;
}

function collectLinkInfo()
{
  var info = {"type": "link"};
  info["text"] = $('#link-text').val();
  info["href"] = $('#link-href').val();
  info["open-in-new-page"] = $('#link-open-in-new-page').is(':checked');
  return info;
}

function renderLink(info, renderf)
{
  var text = info["text"];
  if ( text === undefined || text === "" ) {
    text = info["href"];
  }
  var attrs = '';
  if ( info["open-in-new-page"] ) {
    attrs = ' target="_blank" rel="noopener noreferrer"';
  }
  var s = '<a href="' + info["href"] + '"' + attrs + '>' + text + '</a>';
  return s;
}

function applyMediaDefValues()
{
  $('#image-src').val( MediaCom.defMedia['image-src'] );
  $('#qrcode-src').val( MediaCom.defMedia['qrcode-src'] );
  $('#audio-src').val( MediaCom.defMedia['audio-src'] );
  $('#video-src').val( MediaCom.defMedia['video-src'] );
  $('#video-poster').val( MediaCom.defMedia['video-poster'] );
}

function initMediaInputs()
{
  applyMediaDefValues();

  var modals = $('.modal.options-wrapper');
  modals.on('show.bs.modal', function(e) {
    autoToggleEditorModeAlert();
    updatePreviewer(this);
  }).on('hide.bs.modal', function(e) {
    // reset the code and destroy the previewer
    // for videos and audios, it also stops the previewer from playing
    $(this).find('.previewer').html('');
    $(this).find('.src-code').html('');
  });
  if ( screen.width < 768 ) {
    // initially hide the previewer on xs devices
    modals.find('.previewer-wrapper').hide();
  }
  // initially hide advanced options
  modals.find('.advanced').hide();
}

function togglePreviewer(el, state)
{
  var modal = findParentModal(el);
  var wrapper = modal.find('.previewer-wrapper');
  var visible = !wrapper.is(':hidden');
  //console.log(modal[0].id, visible, state);
  if ( !visible || state === "on" ) {
    wrapper.show(500);
    setTimeout(function(){
      var previewer = modal.find('.previewer')[0];
      previewer.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 700);
  } else if ( visible || state === "off" ) {
    wrapper.hide(500);
  }
}

function updateQRGen(el)
{
  var modal = findParentModal(el);
  var url = modal.find("#qrgen-url").val();
  var size = modal.find("#qrgen-size").val();
  var margin = modal.find("#qrgen-margin").val();
  var color = modal.find("#qrgen-color").val();
  var bgcolor = modal.find("#qrgen-bgcolor").val();
  if ( color.charAt(0) === "#" ) {
    color = color.slice(1);
  }
  if ( bgcolor.charAt(0) === "#" ) {
    bgcolor = bgcolor.slice(1);
  }
  
  var cmd = "http://api.qrserver.com/v1/create-qr-code/?", args = [];
  args.push( "data=" + encodeURIComponent(url) );
  args.push( "size=" + size + "x" + size );
  args.push( "margin=" + margin );
  args.push( "color=" + color );
  args.push( "bgcolor=" + bgcolor );
  cmd += args.join("&");

  //console.log(url, size, margin, color, color.slice(1), bgcolor, bgcolor.slice(1), cmd);
  modal.find("#qrgen-img").prop("src", cmd);
  modal.find("#qrcode-src").val(cmd);
  modal.find("#qrcode-link-href").val(url);
}

$(document).ready(function () {
  initMediaInputs();

  showHideEditor('vis');

  showHideFormatTools(); // must come after the BSW is created

  iOSPrepare();
  buildSelectionSaver(); // initialize selection restoration for visual editor
  focusEditor();
  keepEditorFocused();
  leavePageWarning();
});
