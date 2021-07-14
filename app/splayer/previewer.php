<div id="single-media-previewer">

  <div style="color:#777;padding:1em;">
    注：代码预览可能需要一段时间，请稍等；部分效果可能无法在预览中正常显示
  </div>

  <iframe id="single-media-iframe-previewer"
          class="iframe-previewer"
          scrolling="no"></iframe>

</div> <!-- #single-media-previewer -->

<script>
AppGV.vmSingleMediaPreviewer = new Vue({
  el: "#single-media-previewer",

  data: {
  },

  computed: {
    designer: function() {
      return AppGV.vmSingleMediaDesigner;
    },

    codeWriter: function() {
      return AppGV.vmSingleMediaCodeWriter;
    },

    iframe: function() {
      return document.getElementById("single-media-iframe-previewer");
    },
  },

  methods: {
    makeIframeSrcdoc: function() {
      var s = '<!DOCTYPE html><html><head><meta charset="utf-8">'
          + '</head><body style="margin:0">'
          + this.codeWriter.code
          + '</body></html>';
      return s;
    },

    update: function() {
      var s = this.makeIframeSrcdoc();
      var ifr = this.iframe;
      //console.log(ifr, s);
      if (ifr) {
        ifr.srcdoc = s;
      }
    },

    resizeIframe: function() {
      try {
        var el = this.iframe.contentWindow.document.documentElement;
        if (el && el.scrollHeight >= 80) {
          //console.log(el.scrollHeight);
          this.iframe.style.height = el.scrollHeight + 'px';
        }
      } catch (e) {
      }
    }
  },

  mounted: function() {
    console.log("previewer is mounted");
    setInterval(this.resizeIframe, 200);
  },
});
</script>
