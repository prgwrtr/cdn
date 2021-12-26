/**
 * SoundManager 2: "Bar UI" player
 * Copyright (c) 2014, Scott Schiller. All rights reserved.
 * http://www.schillmania.com/projects/soundmanager2/
 * Code provided under BSD license.
 * http://schillmania.com/projects/soundmanager2/license.txt
 */
!function(e){"use strict";var t,n,a,o,r=[];r.on={},n={stopOtherSounds:!0,excludeClass:"sm2-exclude"},soundManager.setup({html5PollingInterval:50,flashVersion:9}),soundManager.onready(function(){var e,n,o;if((e=a.dom.getAll(".sm2-bar-ui"))&&e.length)for(n=0,o=e.length;n<o;n++)r.push(new t(e[n]))}),t=function(t){var o,l,s,i,u,d,m,c,f,p,g;function v(){n.stopOtherSounds&&soundManager.stopAll()}function h(e,t){e&&(g.on&&g.on[e]?g.on[e](g,t):r.on[e]&&r.on[e](g,t))}function y(e,t){var n=Math.floor(e/1e3),a=Math.floor(n/3600),o=Math.floor(n/60)-Math.floor(60*a),r=Math.floor(n-3600*a-60*o);return t?(a?a+":":"")+(a&&o<10?"0"+o:o)+":"+(r<10?"0"+r:r):{min:o,sec:r}}function x(e){var t=e.getElementsByTagName("a");t.length&&(e=t[0]),l.playlistTarget.innerHTML='<ul class="sm2-playlist-bd"><li>'+e.innerHTML.replace(s.loadFailedCharacter,"")+"</li></ul>",l.playlistTarget.getElementsByTagName("li")[0].scrollWidth>l.playlistTarget.offsetWidth&&(l.playlistTarget.innerHTML='<ul class="sm2-playlist-bd"><li><marquee>'+e.innerHTML+"</marquee></li></ul>")}function T(t){return soundManager.createSound({url:t,volume:f,whileplaying:function(){var e,t;e=Math.min(100,Math.max(0,this.position/this.durationEstimate*100))+"%",t=Math.min(100,Math.max(0,this.position/this.durationEstimate*100))+"%",this.duration&&(l.progress.style.left=e,l.progressBar.style.width=t,l.time.innerHTML=y(this.position,!0)),h("whileplaying",this)},onbufferchange:function(e){e?a.css.add(l.o,"buffering"):a.css.remove(l.o,"buffering")},onplay:function(){a.css.swap(l.o,"paused","playing"),h("play",this)},onpause:function(){a.css.swap(l.o,"playing","paused"),h("pause",this)},onresume:function(){a.css.swap(l.o,"paused","playing")},whileloading:function(){this.isHTML5||(l.duration.innerHTML=y(this.durationEstimate,!0))},onload:function(e){e?l.duration.innerHTML=y(this.duration,!0):this._iO&&this._iO.onerror&&this._iO.onerror()},onerror:function(){var t,n;i.getItem()&&s.loadFailedCharacter&&(l.playlistTarget.innerHTML=l.playlistTarget.innerHTML.replace("<li>","<li>"+s.loadFailedCharacter+" "),i.data.playlist&&i.data.playlist[i.data.selectedIndex]&&-1===(n=(t=i.data.playlist[i.data.selectedIndex].getElementsByTagName("a")[0]).innerHTML).indexOf(s.loadFailedCharacter)&&(t.innerHTML=s.loadFailedCharacter+" "+n)),h("error",this),navigator.userAgent.match(/mobile/i)?d.next():(i.data.timer&&e.clearTimeout(i.data.timer),i.data.timer=e.setTimeout(d.next,2e3))},onstop:function(){a.css.remove(l.o,"playing")},onfinish:function(){var e,t;a.css.remove(l.o,"playing"),l.progress.style.left="0%",e=i.data.selectedIndex,h("finish",this),(t=i.getNext())&&(i.data.selectedIndex!==e||1===i.data.playlist.length&&i.data.loopMode)?(i.select(t),x(t),v(),this.play({url:i.getURL()})):h("end",this)}})}function w(t){soundManager.canPlayURL(t.href)&&(i.data.timer&&(e.clearTimeout(i.data.timer),i.data.timer=null),u||(u=T(t.href)),u.stop(),i.select(t.parentNode),x(t.parentNode),l.progress.style.left="0px",l.progressBar.style.width="0px",v(),u.play({url:t.href,position:0}))}function M(){var t;function n(){return t.playlist}function r(e){var a;return null===t.selectedIndex?e:(a=n(),e=void 0!==e?e:t.selectedIndex,a[e=Math.max(0,Math.min(e,a.length))])}function s(){l.playlist?t.playlist=l.playlist.getElementsByTagName("li"):e.console&&console.warn&&console.warn("refreshDOM(): playlist node not found?")}return t={playlist:[],selectedIndex:0,loopMode:!1,timer:null},f=soundManager.defaultOptions.volume,l.playlistTarget=a.dom.get(l.o,".sm2-playlist-target"),l.playlistContainer=a.dom.get(l.o,".sm2-playlist-drawer"),l.playlist=a.dom.get(l.o,".sm2-playlist-bd"),s(),a.css.has(l.o,o.playlistOpen)&&e.setTimeout(function(){d.menu(!0)},1),{data:t,refresh:s,getNext:function(){return null!==t.selectedIndex&&t.selectedIndex++,t.playlist.length>1?t.selectedIndex>=t.playlist.length&&(t.loopMode?t.selectedIndex=0:t.selectedIndex--):t.selectedIndex=null,r()},getPrevious:function(){return t.selectedIndex--,t.selectedIndex<0&&(t.loopMode?t.selectedIndex=t.playlist.length-1:t.selectedIndex++),r()},getItem:r,getURL:function(){var e,t;return(e=r())&&(t=e.getElementsByTagName("a")[0].href),t},playItemByOffset:function(e){var t;(t=r(e=e||0))&&w(t.getElementsByTagName("a")[0])},select:function(e){var r,s,i,u,d,m;!function(){var e,t,n;for(t=0,n=(e=a.dom.getAll(l.playlist,"."+o.selected)).length;t<n;t++)a.css.remove(e[t],o.selected)}(),e&&(m=a.dom.ancestor("li",e),a.css.add(m,o.selected),(i=(s=e.offsetTop)+e.offsetHeight)>(u=l.playlistContainer.offsetHeight)+(d=l.playlist.scrollTop)?l.playlist.scrollTop=i-u+8:s<d&&(l.playlist.scrollTop=e.offsetTop-8)),r=function(e){var t,a,o,r;if(r=-1,t=n())for(a=0,o=t.length;a<o;a++)if(t[a]===e){r=a;break}return r}(m),t.selectedIndex=r}}}function N(e){return!(!e||!(e.which&&2===e.which||void 0===e.which&&1!==e.button))}function b(t){t&&(m.volume.x=a.position.getOffX(t),m.volume.y=a.position.getOffY(t),m.volume.width=t.offsetWidth,m.volume.height=t.offsetHeight,m.volume.backgroundSize=parseInt(a.style.get(t,"background-size"),10),e.navigator.userAgent.match(/msie|trident/i)&&(m.volume.backgroundSize=m.volume.backgroundSize/m.volume.width*100))}function I(e){var t,n;n=e.target||e.srcElement,N(e)||("a"!==n.nodeName.toLowerCase()&&(t=n.getElementsByTagName("a"))&&t.length&&(n=n.getElementsByTagName("a")[0]),a.css.has(n,"sm2-volume-control")&&(b(n),a.events.add(document,"mousemove",d.adjustVolume),a.events.add(document,"touchmove",d.adjustVolume),a.events.add(document,"mouseup",d.releaseVolume),a.events.add(document,"touchend",d.releaseVolume),d.adjustVolume(e)))}function E(e){var t,n,o,r,s;return t=l.progressTrack,n=a.position.getOffX(t),o=t.offsetWidth,r=(a.events.getClientX(e)-n)/o,(s=u)&&s.duration&&(s.setPosition(s.duration*r),s._iO&&s._iO.whileplaying&&s._iO.whileplaying.apply(s)),e.preventDefault&&e.preventDefault(),!1}function O(e){return a.events.remove(document,"mousemove",E),a.events.remove(document,"touchmove",E),a.css.remove(l.o,"grabbing"),a.events.remove(document,"mouseup",O),a.events.remove(document,"touchend",O),a.events.preventDefault(e),!1}function C(e){N(e)||(a.css.add(l.o,"grabbing"),a.events.add(document,"mousemove",E),a.events.add(document,"touchmove",E),a.events.add(document,"mouseup",O),a.events.add(document,"touchend",O),E(e))}function L(t){var o,r,l,s,i,u,m;if((r=(o=t||e.event).target||o.srcElement)&&r.nodeName){if("a"!==(s=r.nodeName.toLowerCase())&&r.parentNode){do{s=(r=r.parentNode).nodeName.toLowerCase()}while("a"!==s&&r.parentNode);if(!r)return!1}if("a"===s&&(u=r.href,soundManager.canPlayURL(u)?a.css.has(r,n.excludeClass)||(w(r),m=!0):-1!==(l=r.href.lastIndexOf("#"))&&(i=r.href.substr(l+1))&&d[i]&&(m=!0,d[i](t)),m))return a.events.preventDefault(o)}return!0}return o={disabled:"disabled",selected:"selected",active:"active",legacy:"legacy",noVolume:"no-volume",playlistOpen:"playlist-open"},l={o:null,playlist:null,playlistTarget:null,playlistContainer:null,time:null,player:null,progress:null,progressTrack:null,progressBar:null,duration:null,volume:null},s={loadFailedCharacter:''},m={volume:{x:0,y:0,width:0,height:0,backgroundSize:0}},d={play:function(t){var n,a;void 0===t||isNaN(t)?((a=t)&&a.target&&(n=(a.target||a.srcElement).href),n&&-1===n.indexOf("#")||(n=l.playlist.getElementsByTagName("a")[0].href),u||(u=T(n)),u.playState||v(),u.togglePause(),u.paused&&i.data.timer&&(e.clearTimeout(i.data.timer),i.data.timer=null)):i.playItemByOffset(t)},pause:function(){u&&u.readyState&&u.pause()},resume:function(){u&&u.readyState&&u.resume()},stop:function(){return d.pause()},next:function(){var t,n;i.data.timer&&(e.clearTimeout(i.data.timer),i.data.timer=null),n=i.data.selectedIndex,(t=i.getNext(!0))&&i.data.selectedIndex!==n&&w(t.getElementsByTagName("a")[0])},prev:function(){var e,t;t=i.data.selectedIndex,(e=i.getPrevious())&&i.data.selectedIndex!==t&&w(e.getElementsByTagName("a")[0])},shuffle:function(e){var t=e?e.target||e.srcElement:a.dom.get(l.o,".shuffle");t&&!a.css.has(t,o.disabled)&&(a.css.toggle(t.parentNode,o.active),i.data.shuffleMode=!i.data.shuffleMode)},repeat:function(e){var t=e?e.target||e.srcElement:a.dom.get(l.o,".repeat");t&&!a.css.has(t,o.disabled)&&(a.css.toggle(t.parentNode,o.active),i.data.loopMode=!i.data.loopMode)},menu:function(e){var t;t=a.css.has(l.o,o.playlistOpen),!i||i.data.selectedIndex||p||(l.playlist.scrollTop=0,p=!0),"boolean"==typeof e&&e||(t||(l.playlistContainer.style.height="0px"),t=a.css.toggle(l.o,o.playlistOpen)),l.playlistContainer.style.height=(t?l.playlistContainer.scrollHeight:0)+"px"},adjustVolume:function(t){var n,o,r,s,i;if(0,r=l.volume,void 0===t)return!1;var c=a.events.getClientX(t);return t&&void 0!==c?(n=(100-m.volume.backgroundSize)/2,s=Math.max(0,Math.min(1,(c-m.volume.x)/m.volume.width)),r.style.clip="rect(0px, "+m.volume.width*s+"px, "+m.volume.height+"px, "+m.volume.width*(n/100)+"px)",o=n/100*m.volume.width,i=100*Math.max(0,Math.min(1,(c-m.volume.x-o)/(m.volume.width-2*o))),u&&u.setVolume(i),f=i,a.events.preventDefault(t)):(arguments.length&&e.console&&e.console.warn&&console.warn("Bar UI: call setVolume("+t+") instead of adjustVolume("+t+")."),d.setVolume.apply(this,arguments))},releaseVolume:function(){a.events.remove(document,"mousemove",d.adjustVolume),a.events.remove(document,"touchmove",d.adjustVolume),a.events.remove(document,"mouseup",d.releaseVolume),a.events.remove(document,"touchend",d.releaseVolume)},setVolume:function(e){var t,n,a,o,r;void 0===e||isNaN(e)||(l.volume&&(a=l.volume,t=(100-m.volume.backgroundSize)/2,r=(o=n=m.volume.width*(t/100))+(m.volume.width-2*n)*(e/100),a.style.clip="rect(0px, "+r+"px, "+m.volume.height+"px, "+o+"px)"),u&&u.setVolume(e),f=e)}},!t&&e.console&&console.warn&&console.warn("init(): No playerNode element?"),l.o=t,e.navigator.userAgent.match(/msie [678]/i)&&a.css.add(l.o,o.legacy),e.navigator.userAgent.match(/mobile/i)&&a.css.add(l.o,o.noVolume),l.progress=a.dom.get(l.o,".sm2-progress-ball"),l.progressTrack=a.dom.get(l.o,".sm2-progress-track"),l.progressBar=a.dom.get(l.o,".sm2-progress-bar"),l.volume=a.dom.get(l.o,"a.sm2-volume-control"),l.volume&&b(l.volume),l.duration=a.dom.get(l.o,".sm2-inline-duration"),l.time=a.dom.get(l.o,".sm2-inline-time"),i=new M,c=i.getItem(0),i.select(c),c&&x(c),a.events.add(l.o,"mousedown",I),a.events.add(l.o,"touchstart",I),a.events.add(l.o,"click",L),a.events.add(l.progressTrack,"mousedown",C),a.events.add(l.progressTrack,"touchstart",C),g={on:null,actions:d,dom:l,playLink:w,playlistController:i}},a={array:function(){return{compare:function(e){return function(t,n){return t[e]<n[e]?-1:t[e]>n[e]?1:0}},shuffle:function(e){var t,n,a;for(t=e.length-1;t>0;t--)n=Math.floor(Math.random()*(t+1)),a=e[t],e[t]=e[n],e[n]=a;return e}}}(),css:function(){function e(e,t){return void 0!==e.className&&new RegExp("(^|\\s)"+t+"(\\s|$)").test(e.className)}function t(t,n){t&&n&&!e(t,n)&&(t.className=(t.className?t.className+" ":"")+n)}function n(t,n){t&&n&&e(t,n)&&(t.className=t.className.replace(new RegExp("( "+n+")|("+n+")","g"),""))}return{has:e,add:t,remove:n,swap:function(e,a,o){var r={className:e.className};n(r,a),t(r,o),e.className=r.className},toggle:function(a,o){var r;return((r=e(a,o))?n:t)(a,o),!r}}}(),dom:function(){function e(e,t){var n,a,o;return 1===arguments.length?(n=document.documentElement,a=e):(n=e,a=t),n&&n.querySelectorAll&&(o=n.querySelectorAll(a)),o}return{ancestor:function(e,t,n){if(!t||!e)return t;if(e=e.toUpperCase(),n&&t&&t.nodeName===e)return t;for(;t&&t.nodeName!==e&&t.parentNode;)t=t.parentNode;return t&&t.nodeName===e?t:null},get:function(){var t=e.apply(this,arguments);return t&&t.length?t[t.length-1]:t&&0===t.length?null:t},getAll:e}}(),position:function(){return{getOffX:function(e){var t=0;if(e.offsetParent)for(;e.offsetParent;)t+=e.offsetLeft,e=e.offsetParent;else e.x&&(t+=e.x);return t},getOffY:function(e){var t=0;if(e.offsetParent)for(;e.offsetParent;)t+=e.offsetTop,e=e.offsetParent;else e.y&&(t+=e.y);return t}}}(),style:function(){return{get:function(t,n){var a;return t.currentStyle?a=t.currentStyle[n]:e.getComputedStyle&&(a=document.defaultView.getComputedStyle(t,null).getPropertyValue(n)),a}}}(),events:{add:function(t,n,a){var r={detach:function(){return o(t,n,a)}};return e.addEventListener?t.addEventListener(n,a,!1):t.attachEvent("on"+n,a),r},preventDefault:function(e){return e.preventDefault?e.preventDefault():(e.returnValue=!1,e.cancelBubble=!0),!1},remove:o=void 0!==e.removeEventListener?function(e,t,n){return e.removeEventListener(t,n,!1)}:function(e,t,n){return e.detachEvent("on"+t,n)},getClientX:function(e){return e&&(e.clientX||e.touches&&e.touches[0]&&e.touches[0].pageX)}},features:function(){var t,n,a,o,r,l,s;function i(e){return void 0!==l.style[e]?e:null}function u(e){try{l.style[s]=e}catch(e){return!1}return!!l.style[s]}return l=document.createElement("div"),t=(n=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame||null)?function(){return n.apply(e,arguments)}:null,(a={transform:{ie:i("-ms-transform"),moz:i("MozTransform"),opera:i("OTransform"),webkit:i("webkitTransform"),w3:i("transform"),prop:null},rotate:{has3D:!1,prop:null},getAnimationFrame:t}).transform.prop=a.transform.w3||a.transform.moz||a.transform.webkit||a.transform.ie||a.transform.opera,a.transform.prop&&(s=a.transform.prop,u((r={css_2d:"rotate(0deg)",css_3d:"rotate3d(0,0,0,0deg)"}).css_3d)?(a.rotate.has3D=!0,o="rotate3d"):u(r.css_2d)&&(o="rotate"),a.rotate.prop=o),l=null,a}()},e.sm2BarPlayers=r,e.sm2BarPlayerOptions=n,e.SM2BarPlayer=t}(window);
