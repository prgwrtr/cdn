<div id="single-media-code-writer"
     class="code-writer">

  <div class="input-group"
       style="width:100%">
    <label for="code">
      源代码
    </label>
    <textarea id="code"
              v-bind:value="code"
              readonly
              rows=15
              class="form-control">
    </textarea>
  </div>

  <div class="copy-btn-wrapper">
    <button id="copy-code-btn"
            class="btn btn-success"
            type="button"
            v-on:click='copyCode'
            style="float:right">
      复制
    </button>
  </div>

</div> <!-- #single-media-code-writer -->


<script>
AppGV.vmSingleMediaCodeWriter = new Vue({
  el: '#single-media-code-writer',

  data: {
  },

  computed: {
    designer: function() {
      return AppGV.vmSingleMediaDesigner;
    },

    code: function() {
      return this.writeCode();
    },
  },

  methods: {

    writeEmbedderCode: function(values) {
      var version = AppGV.version;
      var servers = AppGV.servers;
      var serverToken = values.pluginServer;
      var serverRoot = servers[serverToken];
      var html = '<div style="display:none">'
          + '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=" alt="." '
          + 'onload=\'(function(){'
          + 'if(window.spInlineEmbedderOnce){return;}'
          + 'else{window.spInlineEmbedderOnce=1;'
          + 'var e=document.createElement("SCRIPT");'
          + 'window.spVersion="' + version + '";'
          + 'window.spRoot="' + serverRoot + '/";'
          + 'e.src="' + serverRoot + '/js/embedder.js?v=' + version + '";'
          + 'document.body.append(e);}})()\'></div>';
      return html;
    },

    processDesignerValues: function() {
      var values = JSON.parse(JSON.stringify(this.designer.values));
      console.log(values, "proccessed");

      // fill missing media src and poster
      if (values.src === "") {
        if (values.mediaType === "audio") {
          values.src = "https://i3.vzan.cc/upload/audio/mp3/20200614/d1c2588412784fa7a2baf8b73242c99a.mp3";
        } else if (values.mediaType === "video") {
          values.src = "https://i3.vzan.cc/upload/video/mp4/20200614/82a09afb5f0548c7a0de4d8d1fd36a65.mp4";
          values.poster = "https://i2.vzan.cc/upload/image/jpg/20200614/77e2f7393bde43238cf3304338446ce5.jpg";
        }
      }

      // convert container margin to wrapper style
      if (values.containerMargin) {
        var cMargin = values.containerMargin;
        var wStyle = values.wrapperStyle;
        if (wStyle === undefined) {
            wStyle = "";
        }
        wStyle = "padding:" + cMargin + ";" + wStyle;
        values.wrapperStyle = wStyle;
        delete values.containerMargin;
      }

      // convert video player margin to container style
      if (values.videoPlayerMargin) {
        var vpMargin = values.videoPlayerMargin;
        var mcStyle = values.mediaContainerStyle;
        if (mcStyle === undefined) {
            mcStyle = "";
        }
        mcStyle = "padding:" + vpMargin + ";" + mcStyle;
        values.mediaContainerStyle = mcStyle;
        delete values.videoPlayerMargin;
      }

      return values;
    },

    writePlayerCode: function(values) {
      var attribList = [];

      for (var i = 0; i < Spgen.fields.length; i++) {
        // filter data attributes, remove null values
        var f = Spgen.fields[i];

        // skip internal options such as installation options
        if (f.internal) {
          continue;
        }

        var val = values[f.varName];
        // console.log("writePlayerCode", f.key, f.varName, val);
        if (val !== undefined && val !== null) {
          if (f.ignoreDefault) {
            // ignore the user's input value if it is the same
            // as the default value
            if (val === f.value) {
              continue;
            }
          } else if (f.dataType === "string"
                  || f.dataType === "time") {
            val = SpgenUtils.htmlEscape(val);
          }

          //console.log(val, f.normalizer);
          if (f.normalizer) {
            val = f.normalizer(val);
          } 
          //console.log(val);

          var fval = f.validator;
          if (fval && !fval(val)) { // call the validater if any
            console.log(f.key, f.varName, "is missing or has an invalid value", val);
            continue;
          }

          attribList.push(f.dataKey + '="' + val + '"');
        }
      }

      // write code
      var s = '<div class="sp-single"';
      if (attribList.length > 0) {
        s += "\n     " + attribList.join("\n     ");
      }
      s += '></div>\n';
      return s;
    },

    writeCode: function() {
      var values = this.processDesignerValues();
      var s = "";
      s += this.writePlayerCode(values);
      s += this.writeEmbedderCode(values);
      s = '<!-- 媒体代码开始 -->\n'
        + s
        + '\n<!-- 媒体代码结束 -->\n';
      return s;
    },

    update: function() {
      this.writeCode();
    },

    copyCode: function(evt) {
      // defined in common1.js
      copyContentToClipboard('#code', '#copy-code-btn');
    },
  },

  mounted: function() {
    console.log("code-writer has been mounted");
  },
});
</script>
