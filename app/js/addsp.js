"use strict";


// annote regions in the input text `s` that should be escaped
// the regions are matched by the regular expression, `re`
// the regions are saved in the table `markers`
// with the starting index being the key
// markers[startIndex] = {...}
// the type of region is given by `type`
function markRE(s, re, markers, type)
{
  var ret, i, j;
  while ( (ret = re.exec(s)) !== null ) {
    i = ret.index;
    j = ret.index + ret[0].length;
    // if the starting position has already been marked
    // and it ends at a later position
    // then skip to the next
    if ( markers[i] && markers[i].end > j ) {
      continue;
    }
    markers[i] = {
      'str': ret[0],
      "end": j,
      "type": type
    };
  }
  return markers;
}

// https://stackoverflow.com/questions/161738/what-is-the-best-regular-expression-to-check-if-a-string-is-a-valid-url+
var reURL1 = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/gi;

// https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
var reURL2 = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

function markURLs(s, markers)
{
  // NOTE: by using multiple patterns, some URL will be saved several times
  // at different starting points. But as long as the earliest position
  // is saved in the table, then it is fine.
  markRE(s, reURL1, markers, "URL");
  markRE(s, reURL2, markers, "URL");
}

// mark Wechat emojis, such as [Smile], and [微笑]
var reWechatEmojis = /\[[^\s]*?\]/gi;

function markWechatEmojis(s, markers)
{
  markRE(s, reWechatEmojis, markers, "WechatEmoji");
}

// mark special regions in the input string the escaped
function markEscape(s)
{
  var markers = {};

  markURLs(s, markers);
  markWechatEmojis(s, markers);
  return markers;
}
/*
var testText = '大家好！hahaha aaa.com 🥰  [微笑] blah http://bbb.org/ blah ftp://abc.baidu.com/a?b=c23%23&e4=56#af?8 [Smile]。';
var msout = markEscape(testText);
for ( var i0 in msout ) {
  console.log( i0, msout[i0].end,  testText.substring(i0, msout[i0].end));
}
*/

// determine the type of the character
// given the unicode character, c, and its numeric unicode value, r
function getCharType(c, r)
{
  var type = 'text';

  // https://en.wikipedia.org/wiki/Unicode_block
  // Whitespace character
  // https://en.wikipedia.org/wiki/Whitespace_character
  if ( // spaces
       ( c === ' ' )
    || ( r === 0x00A0 ) // NBSP
    || ( r === 0x00AD ) // soft hyphen，软连字号
    || ( r === 0xFEFF ) // BOM
    || ( r === 0x034F )
    || ( r >=  0x2000 && r <=  0x200F )
    || ( r === 0x2011 )
    || ( r === 0x202F ) // Narrow no-break space
    || ( r === 0x205F ) // Medium Mathematical space
    || ( r === 0x180E ) // Mongolian vowel separator
    || ( r === 0x2060 ) // word joiner
    || ( r === 0x3000 ) // CJK full width space
  ) {
    type = 'space';
  } else if (
       ( r >=  0x0000 && r <=  0x001F )
    || ( r >=  0x0080 && r <=  0x009F )
  ) {
    type = 'control';
  } else if ( // punctuation marks
       // General Punctuation
       // https://en.wikipedia.org/wiki/General_Punctuation
       ( r >=  0x2010 && r <=  0x206F )
    || ( r >=  0x0021 && r <=  0x002F )
    || ( r >=  0x003A && r <=  0x0040 )
    || ( r >=  0x005B && r <=  0x0060 )
    || ( r >=  0x007B && r <=  0x007E )
       // CJK Symbols and Punctuations
       // https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation
    || ( r >=  0x3001 && r <=  0x303F )
       // Halfwidth and Fullwidth Forms (Unicode block)
       // https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)
    || ( r >=  0xFF01 && r <=  0xFFEF )
    || ( r === 0x00B7 )
    || ( r === 0x02D1 )
    || ( r === 0x02D9 )
    || ( r === 0x22C5 )
  ) {
    type = 'punct';
  } else if ( // Combining Diacritical Marks
    // https://en.wikipedia.org/wiki/Combining_Diacritical_Marks
       ( r >=  0x0300 && r <= 0x03FF )
    || ( r === 0x1DF8 )
    || ( r === 0xABED )
  ) {
    type = 'diacr';
  } else if (
       ( r >= 0x00030 && r <= 0x00039 ) // numbers
    || ( r >= 0x000A1 && r <= 0x000BF )
    || ( r >= 0x00250 && r <= 0x002FF )
    || ( r >= 0x02000 && r <= 0x02C5F )
    || ( r >= 0x03200 && r <= 0x032FF )
    || ( r >= 0x1F000 && r <= 0x1FAFF )
  ) {
    type = 'symbol';
  }
  return type;
}

// get a UTF-16 character at the ith 16-bit position
// https://unicodebook.readthedocs.io/unicode_encodings.html#surrogates
// https://mathiasbynens.be/notes/javascript-encoding
function getCharAt(s, i)
{
  var n = s.length;
  if ( i < 0 || i >= n ) {
    // empty character
    return null;
  }

  var c = s.charAt(i);
  var r = c.charCodeAt(0);
  var n = s.length;
  var len = 1;
  if ( r >= 0xD800 && r <= 0xDBFF ) {
    if ( i < n - 1 ) {
      var c2 = s.charAt(i+1);
      var r2 = c2.charCodeAt(0);
      r = 0x10000 + ( (r & 0x3FF) << 10 ) + (r2 & 0x3FF);
      c += c2;
      len = 2;
    } else {
      // corruption
      console.log("error: need the low surrogate at the end of the string "
        + s + " " + i);
    }
  } else if ( r >= 0xDC00 && r <= 0xDFFF ) {
    // corruption
    console.log("error: corrupted position of "
      + s + " " + i + " " + c);
  }

  var reprTable = {
    0xA0:   'NBSP',
    0xFEFF: 'BOM', // byte order mark
    0x3000: 'FWSP',
    0x34F:  'CGJ', // combining grapheme joiner
    0x180E: 'MVS', // Mongolian vowel separator
    0x2009: 'THSP', // thin space
    0x200A: 'HSP', // hair space
    0x202F: 'NNBSP', // narrow no-break space
    0x205F: 'MMSP', // mediam mathematical space
    0x200B: 'ZWSP', // zero-width space
    0x200C: 'ZWNJ', // zero-width non-joiner
    0x200D: 'ZWJ', // zero-width joiner
    0x2060: 'WJ', // word joiner
  };
  var repr = reprTable[r];
  if ( repr === undefined ) {
    repr = r.toString(16).toUpperCase();
  }

  return {
    "ch": c,
    "code": r,
    "repr": repr,
    "len": len,
    "type": getCharType(c, r)
  };
}

function getMode()
{
  return $('#mode-sel :selected').val();
}

function selectMode()
{
  var opt = $('#mode-sel :selected');

  // update the description
  var descr = opt.attr('title');
  if ( !descr ) descr = "";
  $('#mode-sel-help').html( descr );
/*
  var mode = opt.val();

  if ( mode === 'all' ) {
    $('#user-mode-wrapper').hide();
  } else {
    $('#user-mode-wrapper').show().focus();
  }
*/
  // update the output
  addSpaces();
}

function toggleModePanel()
{
  var panel = $('#user-mode-wrapper');
  if ( panel.is(':visible') ) {
    panel.hide();
  } else {
    panel.show();
    // select the user-defined option
    //$('#sep-sel').val('user-defined');
  }
  /*
  if ( panel.is(':visible') ) {
    focusModeInput();
  }
  */
}


function selectSeparator()
{
  var opt = $('#sep-sel :selected');

  // update the description
  var descr = opt.attr('title');
  if ( !descr ) descr = "";
  $('#sep-sel-help').html( descr );

  // hide or show the user-input panel
  var sc = opt.val();
  if ( sc === 'user-defined' ) {
    $('#user-sep-wrapper').show();
    focusSeparatorInput();
  } else {
    $('#user-sep-wrapper').hide();
  }

  // update the output
  addSpaces();
}

function toggleUserSpacePanel()
{
  var panel = $('#user-sep-wrapper');
  if ( panel.is(':visible') ) {
    panel.hide();
  } else {
    panel.show();
    // select the user-defined option
    $('#sep-sel').val('user-defined');
  }
  if ( panel.is(':visible') ) {
    focusSeparatorInput();
  }
}

function focusSeparatorInput()
{
  var ci = $('#sep-direct-input-wrapper');

  if ( ci.is(':visible') ) {
    $('#sep-direct-input').focus();
  } else {
    $('#sep-unicode-input').focus();
  }
}

function activateSeparatorInput(mode)
{
  var ci = $('#sep-direct-input-wrapper');
  var ui = $('#sep-unicode-input-wrapper');

  if ( mode === 0 ) {
    ci.show();
    ui.hide();
    $('#sep-direct-input').focus();
  } else {
    ci.hide();
    ui.show();
    $('#sep-unicode-input').focus();
  }
  focusSeparatorInput();
}

function onChangeSeparator()
{
  var ch = $('#sep-direct-input').val();
  var ci = getCharAt(ch, 0);
  if ( !ci ) return;
  $('#sep-unicode-input').val( ci.repr );
  addSpaces();
}

function onChangeSpaceUnicode()
{
  var unicode = $('#sep-unicode-input').val();
  var num = parseInt(unicode, 16);
  var ch = String.fromCharCode(num);
  $('#sep-direct-input').val( ch );
  addSpaces();
}

// get the user-specified separator
function getSeparator()
{
  var sc = $('#sep-sel').val(), ch, num, unicode;

  if ( sc === 'user-defined' ) {
    sc = $('#sep-unicode-input').val();
  } else if ( sc === '' ) {
    return '';
  }
  // strip leading and trailing spaces
  sc = sc.trim();
  // strip the leading 'U+'
  if ( sc.substring(0, 2) === 'U+' ) {
    num = sc.substring(2);
  } else {
    num = sc;
  }
  unicode = parseInt(num, 16);
  ch = String.fromCharCode( unicode );
  return ch;
}

function a2html(s)
{
  var tab = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '\r\n': '<br>',
    '\n\r': '<br>',
    '\n': '<br>',
    '\r': '<br>'
  };
  var c = tab[s];
  return ( c != undefined ) ? c : s;
}

function showSpaceHTML(s)
{
  var i, n, t = "", html;
  i = 0;
  n = s.length;

  // lookup table for char code classes
  var charCodeClasses = getCharCodeClasses(), cls;

  // mark escape regions
  var escTable = markEscape(s), esc;

  while ( i < n ) {
    if ( (esc=escTable[i]) !== undefined ) {
      // encounter an escaped region
      if ( esc.type === 'URL' ) {
        var html = '<a onclick="window.open(\'URL\', \'_blank\')">URL</a>'.replace(
          /URL/g, esc.str);
        t += html;
      } else {
        t += esc.str;
      }
      // go to the end of the escaped region
      i = esc.end;
      continue;
    }

    var ci = getCharAt(s, i);
    html = a2html(ci.ch);

    var repr = '';

    // detect error: the algorithm should skip diacritical marks
    if ( ci.type === 'diacr' ) {
      // this character is a diacritical mark
      alert( html + " " + ci.repr + " is a diacritical mark!" );
    }

    // move to the next character position
    i += ci.len;

    // peek the next character
    var ciNext = null, typeNext = 'text';
    if ( i < n ) {
      ciNext = getCharAt(s, i);
      typeNext = ciNext.type;
    }

    if ( typeNext === 'diacr' ) {
      // the next character is a combining diacritical mark
      // we will scan the next few characters until
      // the sequence of diacritical marks ends
      var j = i;
      while ( j < n ) {
        var cj = getCharAt(s, j);
        if ( cj.type !== 'diacr' ) break;
        html += cj.ch;
        repr += ' ' + cj.repr;
        j += cj.len;
      }
      cls = charCodeClasses['diacr'] || "char-code";
      t += html + '<span class="' + cls + '">' + repr + '</span>';
      //t += '<span class="tip">' + html + '<span class="tip-text">' + repr + '</span></span>';
      i = j;
    } else if ( ci.type === 'text'
             // here we skip ASCII symbols
             || ci.code < 128 ) {
      t += html;
    } else { // control characters, symbols, punctuations, diacritical marks
      cls = charCodeClasses[ci.type] || "char-code";
      t += html + '<span class="' + cls + '">' + ci.repr + '</span>';
      //t += '<span class="tip">' + html
      //   + '<span class="tip-text">' + repr + '</span></span>';
    }
  }
  return t;
}

function getCharCodeClasses()
{
  var showSpaces = $('#output-html-show-spaces').is(':checked');
  var showSymbols = $('#output-html-show-symbols').is(':checked');
  var tab = {
    'text': '',
    'space':    (showSpaces   ? "char-code char-code-space"   : "char-code char-code-hidden"),
    'control':  (showSpaces   ? "char-code char-code-control" : "char-code char-code-hidden"),
    'diacr':    (showSymbols  ? "char-code char-code-diacr"   : "char-code char-code-hidden"),
    'punct':    (showSymbols  ? "char-code char-code-punct"   : "char-code char-code-hidden"),
    'symbol':   (showSymbols  ? "char-code char-code-symbol"  : "char-code char-code-hidden"),
  };
  return tab;
}

// convert a simplified string to a traditional one
function simp2trad(s)
{
  var t = "";
  var i, c, d, pos;
  var strSimpTrad = [
    '“”‘’皑蔼碍爱翱袄奥坝罢摆败颁办绊帮绑镑谤剥饱宝报鲍辈贝钡狈备惫绷笔毕毙闭边编贬变辩辫鳖瘪濒滨宾摈饼拨钵铂驳补参蚕残惭惨灿苍舱仓沧厕侧册测层诧搀掺蝉馋谗缠铲产阐颤场尝长偿肠厂畅钞车彻尘陈衬撑称惩诚骋痴迟驰耻齿炽冲虫宠畴踌筹绸丑橱厨锄雏础储触处传疮闯创锤纯绰辞词赐聪葱囱从丛凑窜错达带贷担单郸掸胆惮诞弹当挡党荡档捣岛祷导盗灯邓敌涤递缔点垫电淀钓调迭谍叠钉顶锭订东动栋冻斗犊独读赌镀锻断缎兑队对吨顿钝夺鹅额讹恶饿儿尔饵贰发罚阀珐矾钒烦范贩饭访纺飞废费纷坟奋愤粪丰枫锋风疯冯缝讽凤肤辐抚辅赋复负讣妇缚该钙盖干赶秆赣冈刚钢纲岗皋镐搁鸽阁铬个给龚宫巩贡钩沟构购够蛊顾剐关观馆惯贯广规硅归龟闺轨诡柜贵刽辊滚锅国过骇韩汉阂鹤贺横轰鸿红后壶护沪户哗华画划话怀坏欢环还缓换唤痪焕涣黄谎挥辉毁贿秽会烩汇讳诲绘荤浑伙获货祸击机积饥讥鸡绩缉极辑级挤几蓟剂济计记际继纪夹荚颊贾钾价驾歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧浆蒋桨奖讲酱胶浇骄娇搅铰矫侥脚饺缴绞轿较秸阶节茎惊经颈静镜径痉竞净纠厩旧驹举据锯惧剧鹃绢杰洁结诫届紧锦仅谨进晋烬尽劲荆觉决诀绝钧军骏开凯颗壳课垦恳抠库裤夸块侩宽矿旷况亏岿窥馈溃扩阔蜡腊莱来赖蓝栏拦篮阑兰澜谰揽览懒缆烂滥捞劳涝乐镭垒类泪篱离里鲤礼丽厉励砾历沥隶俩联莲连镰怜涟帘敛脸链恋炼练粮凉两辆谅疗辽镣猎临邻鳞凛赁龄铃凌灵岭领馏刘龙聋咙笼垄拢陇楼娄搂篓芦卢颅庐炉掳卤虏鲁赂禄录陆驴吕铝侣屡缕虑滤绿峦挛孪滦乱抡轮伦仑沦纶论萝罗逻锣箩骡骆络妈玛码蚂马骂吗买麦卖迈脉瞒馒蛮满谩猫锚铆贸霉没镁门闷们锰梦谜弥觅绵缅庙灭悯闽鸣铭谬谋亩钠纳难挠脑恼闹馁腻撵捻酿鸟聂啮镊镍柠狞宁拧泞钮纽脓浓农疟诺欧鸥殴呕沤盘庞国爱赔喷鹏骗飘频贫苹凭评泼颇扑铺朴谱脐齐骑岂启气弃讫牵扦钎铅迁签谦钱钳潜浅谴堑枪呛墙蔷强抢锹桥乔侨翘窍窃钦亲轻氢倾顷请庆琼穷趋区躯驱龋颧权劝却鹊让饶扰绕热韧认纫荣绒软锐闰润洒萨鳃赛伞丧骚扫涩杀纱筛晒闪陕赡缮伤赏烧绍赊摄慑设绅审婶肾渗声绳胜圣师狮湿诗尸时蚀实识驶势释饰视试寿兽枢输书赎属术树竖数帅双谁税顺说硕烁丝饲耸怂颂讼诵擞苏诉肃虽绥岁孙损笋缩琐锁獭挞抬摊贪瘫滩坛谭谈叹汤烫涛绦腾誊锑题体屉条贴铁厅听烃铜统头图涂团颓蜕脱鸵驮驼椭洼袜弯湾顽万网韦违围为潍维苇伟伪纬谓卫温闻纹稳问瓮挝蜗涡窝呜钨乌诬无芜吴坞雾务误锡牺袭习铣戏细虾辖峡侠狭厦锨鲜纤咸贤衔闲显险现献县馅羡宪线厢镶乡详响项萧销晓啸蝎协挟携胁谐写泻谢锌衅兴汹锈绣虚嘘须许绪续轩悬选癣绚学勋询寻驯训讯逊压鸦鸭哑亚讶阉烟盐严颜阎艳厌砚彦谚验鸯杨扬疡阳痒养样瑶摇尧遥窑谣药爷页业叶医铱颐遗仪彝蚁艺亿忆义诣议谊译异绎荫阴银饮樱婴鹰应缨莹萤营荧蝇颖哟拥佣痈踊咏涌优忧邮铀犹游诱舆鱼渔娱与屿语吁御狱誉预驭鸳渊辕园员圆缘远愿约跃钥岳粤悦阅云郧匀陨运蕴酝晕韵杂灾载攒暂赞赃脏凿枣灶责择则泽贼赠扎札轧铡闸诈斋债毡盏斩辗崭栈战绽张涨帐账胀赵蛰辙锗这贞针侦诊镇阵挣睁狰帧郑证织职执纸挚掷帜质钟终种肿众诌轴皱昼骤猪诸诛烛瞩嘱贮铸筑驻专砖转赚桩庄装妆壮状锥赘坠缀谆浊兹资渍踪综总纵邹诅组钻致钟么为只凶准启板里雳余链泄啰诃阇颠谛忏昙财于抟随堕将刹隐噜祢窭观飒谟适',
    '「」『』皚藹礙愛翺襖奧壩罷擺敗頒辦絆幫綁鎊謗剝飽寶報鮑輩貝鋇狽備憊繃筆畢斃閉邊編貶變辯辮鼈癟瀕濱賓擯餅撥鉢鉑駁補參蠶殘慚慘燦蒼艙倉滄廁側冊測層詫攙摻蟬饞讒纏鏟産闡顫場嘗長償腸廠暢鈔車徹塵陳襯撐稱懲誠騁癡遲馳恥齒熾沖蟲寵疇躊籌綢醜櫥廚鋤雛礎儲觸處傳瘡闖創錘純綽辭詞賜聰蔥囪從叢湊竄錯達帶貸擔單鄲撣膽憚誕彈當擋黨蕩檔搗島禱導盜燈鄧敵滌遞締點墊電澱釣調叠諜疊釘頂錠訂東動棟凍鬥犢獨讀賭鍍鍛斷緞兌隊對噸頓鈍奪鵝額訛惡餓兒爾餌貳發罰閥琺礬釩煩範販飯訪紡飛廢費紛墳奮憤糞豐楓鋒風瘋馮縫諷鳳膚輻撫輔賦復負訃婦縛該鈣蓋幹趕稈贛岡剛鋼綱崗臯鎬擱鴿閣鉻個給龔宮鞏貢鈎溝構購夠蠱顧剮關觀館慣貫廣規矽歸龜閨軌詭櫃貴劊輥滾鍋國過駭韓漢閡鶴賀橫轟鴻紅後壺護滬戶嘩華畫劃話懷壞歡環還緩換喚瘓煥渙黃謊揮輝毀賄穢會燴彙諱誨繪葷渾夥獲貨禍擊機積饑譏雞績緝極輯級擠幾薊劑濟計記際繼紀夾莢頰賈鉀價駕殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗漿蔣槳獎講醬膠澆驕嬌攪鉸矯僥腳餃繳絞轎較稭階節莖驚經頸靜鏡徑痙競淨糾廄舊駒舉據鋸懼劇鵑絹傑潔結誡屆緊錦僅謹進晉燼盡勁荊覺決訣絕鈞軍駿開凱顆殼課墾懇摳庫褲誇塊儈寬礦曠況虧巋窺饋潰擴闊蠟臘萊來賴藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫撈勞澇樂鐳壘類淚籬離裏鯉禮麗厲勵礫曆瀝隸倆聯蓮連鐮憐漣簾斂臉鏈戀煉練糧涼兩輛諒療遼鐐獵臨鄰鱗凜賃齡鈴淩靈嶺領餾劉龍聾嚨籠壟攏隴樓婁摟簍蘆盧顱廬爐擄鹵虜魯賂祿錄陸驢呂鋁侶屢縷慮濾綠巒攣孿灤亂掄輪倫侖淪綸論蘿羅邏鑼籮騾駱絡媽瑪碼螞馬罵嗎買麥賣邁脈瞞饅蠻滿謾貓錨鉚貿黴沒鎂門悶們錳夢謎彌覓綿緬廟滅憫閩鳴銘謬謀畝鈉納難撓腦惱鬧餒膩攆撚釀鳥聶齧鑷鎳檸獰甯擰濘鈕紐膿濃農瘧諾歐鷗毆嘔漚盤龐國愛賠噴鵬騙飄頻貧蘋憑評潑頗撲鋪樸譜臍齊騎豈啓氣棄訖牽扡釺鉛遷簽謙錢鉗潛淺譴塹槍嗆牆薔強搶鍬橋喬僑翹竅竊欽親輕氫傾頃請慶瓊窮趨區軀驅齲顴權勸卻鵲讓饒擾繞熱韌認紉榮絨軟銳閏潤灑薩鰓賽傘喪騷掃澀殺紗篩曬閃陝贍繕傷賞燒紹賒攝懾設紳審嬸腎滲聲繩勝聖師獅濕詩屍時蝕實識駛勢釋飾視試壽獸樞輸書贖屬術樹豎數帥雙誰稅順說碩爍絲飼聳慫頌訟誦擻蘇訴肅雖綏歲孫損筍縮瑣鎖獺撻擡攤貪癱灘壇譚談歎湯燙濤縧騰謄銻題體屜條貼鐵廳聽烴銅統頭圖塗團頹蛻脫鴕馱駝橢窪襪彎灣頑萬網韋違圍為濰維葦偉僞緯謂衛溫聞紋穩問甕撾蝸渦窩嗚鎢烏誣無蕪吳塢霧務誤錫犧襲習銑戲細蝦轄峽俠狹廈鍁鮮纖鹹賢銜閑顯險現獻縣餡羨憲線廂鑲鄉詳響項蕭銷曉嘯蠍協挾攜脅諧寫瀉謝鋅釁興洶鏽繡虛噓須許緒續軒懸選癬絢學勳詢尋馴訓訊遜壓鴉鴨啞亞訝閹煙鹽嚴顔閻豔厭硯彥諺驗鴦楊揚瘍陽癢養樣瑤搖堯遙窯謠藥爺頁業葉醫銥頤遺儀彜蟻藝億憶義詣議誼譯異繹蔭陰銀飲櫻嬰鷹應纓瑩螢營熒蠅穎喲擁傭癰踴詠湧優憂郵鈾猶遊誘輿魚漁娛與嶼語籲禦獄譽預馭鴛淵轅園員圓緣遠願約躍鑰嶽粵悅閱雲鄖勻隕運蘊醞暈韻雜災載攢暫贊贓髒鑿棗竈責擇則澤賊贈紮劄軋鍘閘詐齋債氈盞斬輾嶄棧戰綻張漲帳賬脹趙蟄轍鍺這貞針偵診鎮陣掙睜猙幀鄭證織職執紙摯擲幟質鍾終種腫衆謅軸皺晝驟豬諸誅燭矚囑貯鑄築駐專磚轉賺樁莊裝妝壯狀錐贅墜綴諄濁茲資漬蹤綜總縱鄒詛組鑽緻鐘麼為隻兇準啟闆裡靂餘鍊洩囉訶闍顛諦懺曇財於摶隨墮將剎隱嚕禰窶觀颯謨適'
  ];

  for ( i = 0; i < s.length; i++ ) {
    c = s.charAt(i);
    d = s.charCodeAt(i);
    if ( d > 8000 ) {
      pos = strSimpTrad[0].indexOf(c);
      if ( pos >= 0 ) {
        c = strSimpTrad[1].charAt(pos);
      }
    }
    t += c;
  }
  return t;
}


// add separator, csp, into the string s
function addSpacesAll(s, csp, toTrad)
{
  var i = 0, n = s.length, t = "";
  // mark escape regions
  var escTable = markEscape(s), esc;

  while ( i < n ) {
    // skip the escaped region
    if ( (esc=escTable[i]) !== undefined ) {
      t += esc.str;
      i = esc.end;
      continue;
    }

    var ci = getCharAt(s, i);
    var ch = ci.ch;
    if ( toTrad ) ch = simp2trad(ch);
    t += ch;

    // add a separator after a text character
    if ( ci.type === 'text' ) {
      t += csp;
    }

    i += ci.len;
  }
  return t;
}

// get the list of keywords
function getKeywords()
{
  var s = $('#keyword-editor').val().trim(), i;
  s = s.split('\n');
  var x = [];
  for ( i = 0; i < s.length; i++ ) {
    x.push( s[i].trim() );
  }
  return x;
}

// break a string to an array of UTF-16 characters
// abcd --> [a, b, c, d]
function breakToUTF16Chars(s)
{
  var i = 0, n = s.length, arr = [];
  while ( i < n ) {
    var ci = getCharAt(s, i);
    arr.push( ci );
    i += ci.len;
  }
  return arr;
}

// add separator, csp, into the keywords in string s
// the rules of substitution is in subs
function addSpacesKeywordsLow(s, csp, subs)
{
  var i = 0, n = s.length, t = "";
  // mark escape regions
  var escTable = markEscape(s), esc;
  var start = 0, buf = "", j;

  while ( i < n ) {
    // skip the escaped region
    if ( (esc=escTable[i]) !== undefined ) {
      // handle the buffer (start, i)
      // by making substitutions
      for ( j = 0; j < subs.length; j++ ) {
        buf = buf.replace(subs[j][0], subs[j][1]);
      }
      t += buf;

      t += esc.str;
      start = i = esc.end;
      buf = "";
      continue;
    }

    buf += s.charAt(i);
    i++;
  }

  // handle the trailing buffer (start, n), if any
  if ( buf.length > 0 ) {
    for ( j = 0; j < subs.length; j++ ) {
      buf = buf.replace(subs[j][0], subs[j][1]);
    }
    t += buf;
  }

  return t;
}

// add separator, csp, into the the keywords in string s
function addSpacesKeywords(s, csp, keywords, toTrad)
{
  var i, j, k, ka, re, arr, subs = [];
  // temporary separator, the "bar"
  var sepChar = "\u001F"; // "\x1F"

  // construct a list of substitutions
  for ( i = 0; i < keywords.length; i++ ) {
    arr = breakToUTF16Chars( keywords[i] );
    // construct bar-separated adjacent pairs
    // abcd --> a|b, b|c, c|d
    for ( j = 0; j < arr.length - 1; j++ ) {
      // adjacent pair
      k = arr[j].ch + arr[j+1].ch;
      re = new RegExp(k, "g");
      // replaced by
      ka = arr[j].ch + sepChar + arr[j+1].ch;
      if ( toTrad ) ka = simp2trad(ka);
      subs.push( [re, ka] );
    }
  }

  // make substitutions,
  // skip the escape (reserved) regions
  s = addSpacesKeywordsLow(s, csp, subs);

  // replace consecutive bars, if any,
  // by a singlet of the real separator, csp
  re = new RegExp(sepChar + "+", "g");
  s = s.replace(re, csp);

  return s;
}

// add spaces to the input text
// show the result in the output boxes
function addSpaces()
{
  var s = $('#src-editor').val();
  if ( s.length <= 0 ) return null;

  var cs = getSeparator();
  var mode = getMode();
  var toTrad = $('#simp-to-trad').is(':checked');

  // add space to text
  if ( mode === 'all' ) {
    s = addSpacesAll(s, cs, toTrad);
  } else {
    var keys = getKeywords();
    s = addSpacesKeywords(s, cs, keys, toTrad);
  }

  // show text
  $('#output-text').val(s);

  // show hidden spaces in HTML
  var t = showSpaceHTML(s);
  $('#output-html').html(t);

  return s;
}

// add spaces to the input text
// copy the result to the clipboard
function addSpacesAndCopy(btn)
{
  // add spaces to the input text,
  // show them in the output boxes
  var s = addSpaces();
  if ( s === null ) {
    return;
  }
  // copy the text to the clipboard
  copyTextToClipboard(s, btn);
  // wait 1000ms (for button animation), then show the notice, then hide it
  //animateShow('#copy-success-alert', [0.0, 1000, 0.0, 1000, 1.0, 5000, 1.0, 1000, 0.0]);

  $('#copy-success-alert').delay(1000).slideDown(2000).delay(7000).slideUp(2000);

  // show the output box
  var output = $('#output');
  if ( !output.is(':visible') ) {
    output.slideDown(2000);
  }
}

function refreshHTMLOutput()
{
  addSpaces();
}

function changeOutputMode()
{
  var textOnly = $('#output-text-mode').is(':checked');
  if ( textOnly ) {
    $('#output-html-wrapper').hide();
    $('#output-text-wrapper').show();
  } else {
    $('#output-text-wrapper').hide();
    $('#output-html-wrapper').show();
  }
}

$(document).ready(function () {
  $('#copy-success-alert').hide();

  // display the help text for the separator selector
  selectSeparator();

  // refresh the help text for the mode selector
  selectMode();

  // by default, use the unicode for separator
  $('#sep-direct-input-wrapper').hide();
  // by default, use the direct input for the user-defined separator
  //$('#sep-unicode-input-wrapper').hide();

  // by default, hide the user input panel for the separator
  // activate it only use choose "user-defined" for space input
  $('#user-sep-wrapper').hide();

  // by default, hide the user input panel for the adding mode
  $('#user-mode-wrapper').hide();

  // display the html output box, hide the text one
  $('#output-text-wrapper').hide();

  //$('#options').hide();
  $('#output').hide();

  addSpaces();
});

