"use strict";

var SpgenUtils = (function(){
  function camelToKebab(s) {
    // (?<=...) are not supported by an old Firefox
    //return s.replace(/((?<=[a-z\d])[A-Z]|(?<=[A-Z\d])[A-Z](?=[a-z]))/g, '-$1').toLowerCase();
    return s.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  function kebabToCamel(s) {
    // cf. https://stackoverflow.com/a/60738940
    return s.replace(/-./g, function(x){ return x[1].toUpperCase(); });
  }

  function htmlEscape(val) {
    val = val.replace(/&/g, "&amp;");
    val = val.replace(/"/g, "&quot;");
    return val;
  }

  function normalizeTime(val) {
    val = val.replace(/ /g, "");
    val = val.replace(/：/g, ":"); // replace the Chinese colon by the English one
    return val;
  }

  // return if the time value is valid
  function validateTime(val) {
    if (val == "" || val === null || val === undefined) {
      console.log("missing time", val);
      return false;
    }
    var invalidChar = /[^:0-9.]/.test(val);
    console.log(invalidChar, val);
    return !invalidChar;
  }

  return {
    camelToKebab: camelToKebab,
    kebabToCamel: kebabToCamel,
    htmlEscape: htmlEscape,
    normalizeTime: normalizeTime,
    validateTime: validateTime,
  }
})();



var Spgen = (function(){
  var uiTabs = [{
    key: "basic",
    name: "基本信息",
    fields: [
      {
        key: "media-type",
        name: "媒体类型",
        dataType: "string",
        value: "audio",
        validator: function(val) {
          return (val === "audio" || val === "video");
        },
        uiType: "select",
        options: [
          {value: "audio", name: "音频"},
          {value: "video", name: "视频"},
        ],
      },
      {
        key: "title",
        name: "标题",
        dataType: "string",
        value: "标题",
        validator: function(val) {
          return val !== "";
        },
        uiType: "textarea",
        rows: "3",
        placeholder: "媒体标题",
      },
      {
        key: "src",
        name: "媒体链接",
        dataType: "string",
        value: "",
        validator: function(val) {
          return val !== "";
        },
        uiType: "textarea",
        rows: 3,
        placeholder: "https://i3.vzan.cc/upload/video/mp4/20200614/82a09afb5f0548c7a0de4d8d1fd36a65.mp4",
        hint: '片段音频请尝试：<br><a id="eg-src" '
            + ' href="http://sina.xljt.cloud/xlfm/audio/1.diantaijiemu/2018/201806/wenda20180622.mp3"'
            + ' target="TestLink">http://sina.xljt.cloud/xlfm/audio/1.diantaijiemu/2018/201806/wenda20180622.mp3</a> '
            + '<button class="apply-btn" data-key="src" data-src="#eg-src">应用</button>',
      },
      {
        key: "poster",
        name: "媒体封面",
        dataType: "string",
        value: "",
        validator: function(val) {
          return val !== "";
        },
        uiType: "textarea",
        rows: 3,
        placeholder: "https://i2.vzan.cc/upload/image/jpg/20200614/77e2f7393bde43238cf3304338446ce5.jpg",
      },
      {
        key: "start-time",
        name: "开始时间",
        dataType: "time",
        value: "",
        normalizer: SpgenUtils.normalizeTime,
        validator: SpgenUtils.validateTime,
        uiType: "input",
        placeholder: "00:00:00",
        hint: '片段音频请尝试：<code id="eg-start-time">1:12:26</code> '
            + '<button class="apply-btn" data-key="start-time" data-src="#eg-start-time">应用</button>',
      },
      {
        key: "end-time",
        name: "结束时间",
        dataType: "time",
        value: "",
        normalizer: SpgenUtils.normalizeTime,
        validator: SpgenUtils.validateTime,
        uiType: "input",
        placeholder: "00:00:00",
        hint: '片段音频请尝试：<code id="eg-end-time">1:15:51</code> '
            + '<button class="apply-btn" data-key="end-time" data-src="#eg-end-time">应用</button>',
      },
    ],
  }, // end of the basic tab
  {
    key: "style",
    name: "样式",
    fields: [
      {
        key: "theme",
        name: "主题色调",
        dataType: "string",
        value: "light",
        validator: function(val) {
          return (val === "light" || val === "dark");
        },
        uiType: "select",
        options: [
          {value: "light", name: "浅色（黑色字体）"},
          {value: "dark", name: "深色（白色字体）"},
        ],
      },
      {
        key: "foreground-color",
        name: "字体色",
        dataType: "string",
        value: "#555555",
        validator: function(val) {
          return val !== "";
        },
        uiType: "color",
        ignoreDefault: true, // ignore the user's input if it is the same as the default one
      },
      {
        key: "background-color",
        name: "背景色",
        dataType: "string",
        value: "#ffffff",
        validator: function(val) {
          return val !== "";
        },
        uiType: "color",
        ignoreDefault: true, // ignore the user's input if it is the same as the default one
      },
      {
        key: "container-margin",
        name: "控件外边距",
        dataType: "string",
        value: "",
        validator: function(val) {
          return val !== "";
        },
        uiType: "input",
        placeholder: "10px",
        ignoreDefault: true,
      },
      {
        key: "video-player-margin",
        name: "视频内边距",
        dataType: "string",
        value: "",
        validator: function(val) {
          return val !== "";
        },
        uiType: "input",
        placeholder: "20px",
        ignoreDefault: true,
      },
      {
        key: "wrapper-style",
        name: "外容器样式",
        dataType: "string",
        value: "",
        validator: function(val) {
          return val !== "";
        },
        uiType: "textarea",
        rows: 3,
        placeholder: "margin:0px;padding:0px;",
        ignoreDefault: true,
      },
      {
        key: "container-style",
        name: "内容器样式",
        dataType: "string",
        value: "",
        validator: function(val) {
          return val !== "";
        },
        uiType: "textarea",
        rows: 3,
        placeholder: "margin:0px;padding:0px;",
        ignoreDefault: true,
      },
      {
        key: "media-container-style",
        name: "视频框样式",
        dataType: "string",
        value: "",
        validator: function(val) {
          return val !== "";
        },
        uiType: "textarea",
        rows: 3,
        placeholder: "margin:0px;padding:0px;",
        ignoreDefault: true,
      },
    ],
  }, // end of the style tab
  {
    key: "installer-options",
    name: "安装选项",
    fields: [
      {
        key: "plugin-server",
        name: "服务器",
        dataType: "string",
        value: "cdn",
        validator: function(val) {
          return val !== "";
        },
        uiType: "select",
        options: [
          {value: "cdn", name: "CDN"},
          {value: "xljt", name: "XLJT"},
          {value: "bhffer", name: "bhffer"},
          {value: "local", name: "内部测试"},
        ],
        internal: true,
      }
    ],
  }, // end of installer-options tab
  ];

  function getVarName(key) {
    return SpgenUtils.kebabToCamel(key);
  }

  // add "dataKey" and "varName"
  function processUiTabs() {
    for (var i = 0; i < uiTabs.length; i++) { // tabs
      var fields = uiTabs[i].fields;
      for (var j = 0; j < fields.length; j++) {
        var key = fields[j].key;
        fields[j].dataKey = "data-" + key;
        fields[j].varName = getVarName(key);
      }
    }
  }

  // return a dictionary of values
  function getValues() {
    var values = {};
    var fields = getAllFields();
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      values[f.varName] = f.value;
      //console.log(f.key, f.varName, f.value);
    }
    return values;
  }

  function getAllFields() {
    var allFields = [];
    for (var i = 0; i < uiTabs.length; i++) { // tabs
      allFields = allFields.concat(uiTabs[i].fields);
    }
    return allFields;
  }

  var fields = getAllFields();

  function getFieldDict() {
    var d = {};
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      d[f.key] = f;
      d[f.varName] = f;
    }
    return d;
  }

  var fieldDict = getFieldDict();

  function init() {
    processUiTabs();
  }

  init();

  return {
    uiTabs: uiTabs,
    fields: fields,
    fieldDict: fieldDict,
    getValues: getValues,
  };
})();

