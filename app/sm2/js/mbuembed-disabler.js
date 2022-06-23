// This file disables the dynamic loading script mbuembed.js.
// It is to be placed before all audio lists.
// It also contains customized routines for the comiis theme
;(function(){

  window.mbuEmbedOnce = 1; // disabling the dynamics loader

  // periodically remove tags like this
  // <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/prgwrtr/cdn@latest/app/sm2/css/bar-ui-patch.min.css?v=0.1.38"/>
  // which will take forever to load
  setInterval(function(){

    // disabling style sheets
    document.querySelectorAll('link').forEach(function(el){
      var url = el.href;
      if (url.indexOf("cdn.jsdelivr.net") >= 0 && url.indexOf("bar-ui-patch.min.css") >= 0) {
        el.parentNode.removeChild(el);
      }
    });

    // disabling JavaScripts
    document.querySelectorAll('script').forEach(function(el){
      var url = el.src;
      if (url.indexOf("cdn.jsdelivr.net") >= 0 &&
      (url.indexOf("mbuembed.min.js") >= 0 || url.indexOf("mbuembed.js") >= 0) ) {
        el.parentNode.removeChild(el);
      }
    });

  }, 1000);

  function findJS(needle) {
    var x = document.querySelectorAll("script");
    for (var i = 0; i < x.length; i++) {
      if (x[i].src.indexOf(needle) >= 0) return x[i];
    };
    return null;
  }

  function findCSS(needle) {
    var x = document.querySelectorAll("link");
    for (var i = 0; i < x.length; i++) {
      if (x[i].href.indexOf(needle) >= 0) return x[i];
    };
    return null;
  }

  var isComiisMobileTheme = (findJS("comiis/js/common_u.js") !== null);
  var isComiisTheme = isComiisMobileTheme || (findCSS("comiis_app/comiis/comiis_flxx/comiis_pcflxx.css") !== null);
  //console.log(isComiisMobileTheme, isComiisTheme);

  // special patch for comiis mobile theme to disable links
  // since common_u.js is loaded at the very beginning,
  // we should do this as soon as possible
  if (isComiisMobileTheme) {
    // undo template/comiis_app/comiis/js/common_u.js, line 1329~1331
    // $(document).on('click', 'a', function(e) { ...
    var docReady = false;
    $(document).ready(function() {
      docReady = true;
      $(document).off('click', 'a');
    });
    // we periodically turn off the handler for <a> clicks
    aClickChecker = setInterval(function() {
      $(document).off('click', 'a');
      if (docReady) clearInterval(aClickChecker);
    }, 1000);
  }

  if (isComiisTheme) {
    // The comiis theme will wrap every <a> tag in a <p> tag
    // and put another <a> tag without content right before the <p> tag
    // so it results in two <a> tags under a single <li>
    // we will hide the second <a> tag within the <li> and move the content to the first
    setInterval(function(){
      document.querySelectorAll(".sm2-bar-ui .sm2-playlist-wrapper li").forEach(function(item){
        var a1 = item.querySelector("a");
        if (!a1 || !a1.href || a1.parentNode !== item) return;
        var a2 = item.querySelector("p > a");
        if (!a2 || !a2.href || a1.href !== a2.href) return;
        if (a2.innerHTML.trim() !== '') {
          a1.innerHTML = a2.innerHTML;
        }
        a2.parentNode.style.display = "none"; // hide this element
      });
    }, 1000);

    // Disabling default clicking behavior for <a> tags in player items
    setInterval(function(){
      document.querySelectorAll(".sm2-bar-ui .sm2-playlist-wrapper li a").forEach(function(a){
        if (!a.clickingDisabled) {
          a.clickingDisabled = true;
          a.addEventListener("click", function(e){ // disabling clicking
            e.preventDefault();
          });
        }
      });
    }, 1000);
  }

})();
