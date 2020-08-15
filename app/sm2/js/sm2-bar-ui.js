/** @license
*
* SoundManager 2: JavaScript Sound for the Web
* ----------------------------------------------
* http://schillmania.com/projects/soundmanager2/
*
* Copyright (c) 2007, Scott Schiller. All rights reserved.
* Code provided under the BSD License:
* http://schillmania.com/projects/soundmanager2/license.txt
*
* V2.97a.20170601
*/
/**
* About this file
* -------------------------------------------------------------------------------------
* This is the fully-commented source version of the SoundManager 2 API,
* recommended for use during development and testing.
*
* See soundmanager2-nodebug-jsmin.js for an optimized build (~11KB with gzip.)
* http://schillmania.com/projects/soundmanager2/doc/getstarted/#basic-inclusion
* Alternately, serve this file with gzip for 75% compression savings (~30KB over HTTP.)
*
* You may notice <d> and </d> comments in this source; these are delimiters for
* debug blocks which are removed in the -nodebug builds, further optimizing code size.
*
* Also, as you may note: Whoa, reliable cross-platform/device audio support is hard! ;)
*/
(function SM2(window, _undefined) {
/* global Audio, document, window, navigator, define, module, SM2_DEFER, opera, setTimeout, setInterval, clearTimeout, sm2Debugger */
'use strict';
if (!window || !window.document) {
throw new Error('SoundManager requires a browser with window and document objects.');
}
var soundManager = null;
/**
* The SoundManager constructor.
*
* @constructor
* @param {string} smURL Optional: Path to SWF files
* @param {string} smID Optional: The ID to use for the SWF container element
* @this {SoundManager}
* @return {SoundManager} The new SoundManager instance
*/
function SoundManager(smURL, smID) {
/**
* soundManager configuration options list
* defines top-level configuration properties to be applied to the soundManager instance (eg. soundManager.flashVersion)
* to set these properties, use the setup() method - eg., soundManager.setup({url: '/swf/', flashVersion: 9})
*/
this.setupOptions = {
url: (smURL || null),             // path (directory) where SoundManager 2 SWFs exist, eg., /path/to/swfs/
flashVersion: 8,                  // flash build to use (8 or 9.) Some API features require 9.
debugMode: true,                  // enable debugging output (console.log() with HTML fallback)
debugFlash: false,                // enable debugging output inside SWF, troubleshoot Flash/browser issues
useConsole: true,                 // use console.log() if available (otherwise, writes to #soundmanager-debug element)
consoleOnly: true,                // if console is being used, do not create/write to #soundmanager-debug
waitForWindowLoad: false,         // force SM2 to wait for window.onload() before trying to call soundManager.onload()
bgColor: '#ffffff',               // SWF background color. N/A when wmode = 'transparent'
useHighPerformance: false,        // position:fixed flash movie can help increase js/flash speed, minimize lag
flashPollingInterval: null,       // msec affecting whileplaying/loading callback frequency. If null, default of 50 msec is used.
html5PollingInterval: null,       // msec affecting whileplaying() for HTML5 audio, excluding mobile devices. If null, native HTML5 update events are used.
flashLoadTimeout: 1000,           // msec to wait for flash movie to load before failing (0 = infinity)
wmode: null,                      // flash rendering mode - null, 'transparent', or 'opaque' (last two allow z-index to work)
allowScriptAccess: 'always',      // for scripting the SWF (object/embed property), 'always' or 'sameDomain'
useFlashBlock: false,             // *requires flashblock.css, see demos* - allow recovery from flash blockers. Wait indefinitely and apply timeout CSS to SWF, if applicable.
useHTML5Audio: true,              // use HTML5 Audio() where API is supported (most Safari, Chrome versions), Firefox (MP3/MP4 support varies.) Ideally, transparent vs. Flash API where possible.
forceUseGlobalHTML5Audio: false,  // if true, a single Audio() object is used for all sounds - and only one can play at a time.
ignoreMobileRestrictions: false,  // if true, SM2 will not apply global HTML5 audio rules to mobile UAs. iOS > 7 and WebViews may allow multiple Audio() instances.
html5Test: /^(probably|maybe)$/i, // HTML5 Audio() format support test. Use /^probably$/i; if you want to be more conservative.
preferFlash: false,               // overrides useHTML5audio, will use Flash for MP3/MP4/AAC if present. Potential option if HTML5 playback with these formats is quirky.
noSWFCache: false,                // if true, appends ?ts={date} to break aggressive SWF caching.
idPrefix: 'sound'                 // if an id is not provided to createSound(), this prefix is used for generated IDs - 'sound0', 'sound1' etc.
};
this.defaultOptions = {
/**
* the default configuration for sound objects made with createSound() and related methods
* eg., volume, auto-load behaviour and so forth
*/
autoLoad: false,        // enable automatic loading (otherwise .load() will be called on demand with .play(), the latter being nicer on bandwidth - if you want to .load yourself, you also can)
autoPlay: false,        // enable playing of file as soon as possible (much faster if "stream" is true)
from: null,             // position to start playback within a sound (msec), default = beginning
loops: 1,               // how many times to repeat the sound (position will wrap around to 0, setPosition() will break out of loop when >0)
onid3: null,            // callback function for "ID3 data is added/available"
onerror: null,          // callback function for "load failed" (or, playback/network/decode error under HTML5.)
onload: null,           // callback function for "load finished"
whileloading: null,     // callback function for "download progress update" (X of Y bytes received)
onplay: null,           // callback for "play" start
onpause: null,          // callback for "pause"
onresume: null,         // callback for "resume" (pause toggle)
whileplaying: null,     // callback during play (position update)
onposition: null,       // object containing times and function callbacks for positions of interest
onstop: null,           // callback for "user stop"
onfinish: null,         // callback function for "sound finished playing"
multiShot: true,        // let sounds "restart" or layer on top of each other when played multiple times, rather than one-shot/one at a time
multiShotEvents: false, // fire multiple sound events (currently onfinish() only) when multiShot is enabled
position: null,         // offset (milliseconds) to seek to within loaded sound data.
pan: 0,                 // "pan" settings, left-to-right, -100 to 100
playbackRate: 1,        // rate at which to play the sound (HTML5-only)
stream: true,           // allows playing before entire file has loaded (recommended)
to: null,               // position to end playback within a sound (msec), default = end
type: null,             // MIME-like hint for file pattern / canPlay() tests, eg. audio/mp3
usePolicyFile: false,   // enable crossdomain.xml request for audio on remote domains (for ID3/waveform access)
volume: 100             // self-explanatory. 0-100, the latter being the max.
};
this.flash9Options = {
/**
* flash 9-only options,
* merged into defaultOptions if flash 9 is being used
*/
onfailure: null,        // callback function for when playing fails (Flash 9, MovieStar + RTMP-only)
isMovieStar: null,      // "MovieStar" MPEG4 audio mode. Null (default) = auto detect MP4, AAC etc. based on URL. true = force on, ignore URL
usePeakData: false,     // enable left/right channel peak (level) data
useWaveformData: false, // enable sound spectrum (raw waveform data) - NOTE: May increase CPU load.
useEQData: false,       // enable sound EQ (frequency spectrum data) - NOTE: May increase CPU load.
onbufferchange: null,   // callback for "isBuffering" property change
ondataerror: null       // callback for waveform/eq data access error (flash playing audio in other tabs/domains)
};
this.movieStarOptions = {
/**
* flash 9.0r115+ MPEG4 audio options,
* merged into defaultOptions if flash 9+movieStar mode is enabled
*/
bufferTime: 3,          // seconds of data to buffer before playback begins (null = flash default of 0.1 seconds - if AAC playback is gappy, try increasing.)
serverURL: null,        // rtmp: FMS or FMIS server to connect to, required when requesting media via RTMP or one of its variants
onconnect: null,        // rtmp: callback for connection to flash media server
duration: null          // rtmp: song duration (msec)
};
this.audioFormats = {
/**
* determines HTML5 support + flash requirements.
* if no support (via flash and/or HTML5) for a "required" format, SM2 will fail to start.
* flash fallback is used for MP3 or MP4 if HTML5 can't play it (or if preferFlash = true)
*/
mp3: {
type: ['audio/mpeg; codecs="mp3"', 'audio/mpeg', 'audio/mp3', 'audio/MPA', 'audio/mpa-robust'],
required: true
},
mp4: {
related: ['aac', 'm4a', 'm4b'], // additional formats under the MP4 container
type: ['audio/mp4; codecs="mp4a.40.2"', 'audio/aac', 'audio/x-m4a', 'audio/MP4A-LATM', 'audio/mpeg4-generic'],
required: false
},
ogg: {
type: ['audio/ogg; codecs=vorbis'],
required: false
},
opus: {
type: ['audio/ogg; codecs=opus', 'audio/opus'],
required: false
},
wav: {
type: ['audio/wav; codecs="1"', 'audio/wav', 'audio/wave', 'audio/x-wav'],
required: false
},
flac: {
type: ['audio/flac'],
required: false
}
};
this.movieID = 'sm2-container';
this.id = (smID || 'sm2movie');
this.debugID = 'soundmanager-debug';
this.debugURLParam = /([#?&])debug=1/i;
this.versionNumber = 'V2.97a.20170601';
this.version = null;
this.movieURL = null;
this.altURL = null;
this.swfLoaded = false;
this.enabled = false;
this.oMC = null;
this.sounds = {};
this.soundIDs = [];
this.muted = false;
this.didFlashBlock = false;
this.filePattern = null;
this.filePatterns = {
flash8: /\.mp3(\?.*)?$/i,
flash9: /\.mp3(\?.*)?$/i
};
this.features = {
buffering: false,
peakData: false,
waveformData: false,
eqData: false,
movieStar: false
};
this.sandbox = {
type: null,
types: {
remote: 'remote (domain-based) rules',
localWithFile: 'local with file access (no internet access)',
localWithNetwork: 'local with network (internet access only, no local access)',
localTrusted: 'local, trusted (local+internet access)'
},
description: null,
noRemote: null,
noLocal: null
};
/**
* format support (html5/flash)
* stores canPlayType() results based on audioFormats.
* eg. { mp3: boolean, mp4: boolean }
* treat as read-only.
*/
this.html5 = {
usingFlash: null // set if/when flash fallback is needed
};
this.flash = {};
this.html5Only = false;
this.ignoreFlash = false;
/**
* a few private internals (OK, a lot. :D)
*/
var SMSound,
sm2 = this, globalHTML5Audio = null, flash = null, sm = 'soundManager', smc = sm + ': ', h5 = 'HTML5::', id, ua = navigator.userAgent, wl = window.location.href.toString(), doc = document, doNothing, setProperties, init, fV, on_queue = [], debugOpen = true, debugTS, didAppend = false, appendSuccess = false, didInit = false, disabled = false, windowLoaded = false, _wDS, wdCount = 0, initComplete, mixin, assign, extraOptions, addOnEvent, processOnEvents, initUserOnload, delayWaitForEI, waitForEI, rebootIntoHTML5, setVersionInfo, handleFocus, strings, initMovie, domContentLoaded, winOnLoad, didDCLoaded, getDocument, createMovie, catchError, setPolling, initDebug, debugLevels = ['log', 'info', 'warn', 'error'], defaultFlashVersion = 8, disableObject, failSafely, normalizeMovieURL, oRemoved = null, oRemovedHTML = null, str, flashBlockHandler, getSWFCSS, swfCSS, toggleDebug, loopFix, policyFix, complain, idCheck, waitingForEI = false, initPending = false, startTimer, stopTimer, timerExecute, h5TimerCount = 0, h5IntervalTimer = null, parseURL, messages = [],
canIgnoreFlash, needsFlash = null, featureCheck, html5OK, html5CanPlay, html5ErrorCodes, html5Ext, html5Unload, domContentLoadedIE, testHTML5, event, slice = Array.prototype.slice, useGlobalHTML5Audio = false, lastGlobalHTML5URL, hasFlash, detectFlash, badSafariFix, html5_events, showSupport, flushMessages, wrapCallback, idCounter = 0, didSetup, msecScale = 1000,
is_iDevice = ua.match(/(ipad|iphone|ipod)/i), isAndroid = ua.match(/android/i), isIE = ua.match(/msie|trident/i),
isWebkit = ua.match(/webkit/i),
isSafari = (ua.match(/safari/i) && !ua.match(/chrome/i)),
isOpera = (ua.match(/opera/i)),
mobileHTML5 = (ua.match(/(mobile|pre\/|xoom)/i) || is_iDevice || isAndroid),
isBadSafari = (!wl.match(/usehtml5audio/i) && !wl.match(/sm2-ignorebadua/i) && isSafari && !ua.match(/silk/i) && ua.match(/OS\sX\s10_6_([3-7])/i)), // Safari 4 and 5 (excluding Kindle Fire, "Silk") occasionally fail to load/play HTML5 audio on Snow Leopard 10.6.3 through 10.6.7 due to bug(s) in QuickTime X and/or other underlying frameworks. :/ Confirmed bug. https://bugs.webkit.org/show_bug.cgi?id=32159
hasConsole = (window.console !== _undefined && console.log !== _undefined),
isFocused = (doc.hasFocus !== _undefined ? doc.hasFocus() : null),
tryInitOnFocus = (isSafari && (doc.hasFocus === _undefined || !doc.hasFocus())),
okToDisable = !tryInitOnFocus,
flashMIME = /(mp3|mp4|mpa|m4a|m4b)/i,
emptyURL = 'about:blank', // safe URL to unload, or load nothing from (flash 8 + most HTML5 UAs)
emptyWAV = 'data:audio/wave;base64,/UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAD//w==', // tiny WAV for HTML5 unloading
overHTTP = (doc.location ? doc.location.protocol.match(/http/i) : null),
http = (!overHTTP ? '//' : ''),
netStreamMimeTypes = /^\s*audio\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4|m4v|m4a|m4b|mp4v|3gp|3g2)\s*(?:$|;)/i,
netStreamTypes = ['mpeg4', 'aac', 'flv', 'mov', 'mp4', 'm4v', 'f4v', 'm4a', 'm4b', 'mp4v', '3gp', '3g2'],
netStreamPattern = new RegExp('\\.(' + netStreamTypes.join('|') + ')(\\?.*)?$', 'i');
this.mimePattern = /^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i; // default mp3 set
this.useAltURL = !overHTTP;
swfCSS = {
swfBox: 'sm2-object-box',
swfDefault: 'movieContainer',
swfError: 'swf_error', // SWF loaded, but SM2 couldn't start (other error)
swfTimedout: 'swf_timedout',
swfLoaded: 'swf_loaded',
swfUnblocked: 'swf_unblocked', // or loaded OK
sm2Debug: 'sm2_debug',
highPerf: 'high_performance',
flashDebug: 'flash_debug'
};
/**
* HTML5 error codes, per W3C
* Error code 1, MEDIA_ERR_ABORTED: Client aborted download at user's request.
* Error code 2, MEDIA_ERR_NETWORK: A network error of some description caused the user agent to stop fetching the media resource, after the resource was established to be usable.
* Error code 3, MEDIA_ERR_DECODE: An error of some description occurred while decoding the media resource, after the resource was established to be usable.
* Error code 4, MEDIA_ERR_SRC_NOT_SUPPORTED: Media (audio file) not supported ("not usable.")
* Reference: https://html.spec.whatwg.org/multipage/embedded-content.html#error-codes
*/
html5ErrorCodes = [
null,
'MEDIA_ERR_ABORTED',
'MEDIA_ERR_NETWORK',
'MEDIA_ERR_DECODE',
'MEDIA_ERR_SRC_NOT_SUPPORTED'
];
/**
* basic HTML5 Audio() support test
* try...catch because of IE 9 "not implemented" nonsense
* https://github.com/Modernizr/Modernizr/issues/224
*/
this.hasHTML5 = (function() {
try {
return (Audio !== _undefined && (isOpera && opera !== _undefined && opera.version() < 10 ? new Audio(null) : new Audio()).canPlayType !== _undefined);
} catch(e) {
return false;
}
}());
/**
* Public SoundManager API
* -----------------------
*/
/**
* Configures top-level soundManager properties.
*
* @param {object} options Option parameters, eg. { flashVersion: 9, url: '/path/to/swfs/' }
* onready and ontimeout are also accepted parameters. call soundManager.setup() to see the full list.
*/
this.setup = function(options) {
var noURL = (!sm2.url);
if (options !== _undefined && didInit && needsFlash && sm2.ok() && (options.flashVersion !== _undefined || options.url !== _undefined || options.html5Test !== _undefined)) {
complain(str('setupLate'));
}
assign(options);
if (!useGlobalHTML5Audio) {
if (mobileHTML5) {
if (!sm2.setupOptions.ignoreMobileRestrictions || sm2.setupOptions.forceUseGlobalHTML5Audio) {
messages.push(strings.globalHTML5);
useGlobalHTML5Audio = true;
}
} else if (sm2.setupOptions.forceUseGlobalHTML5Audio) {
messages.push(strings.globalHTML5);
useGlobalHTML5Audio = true;
}
}
if (!didSetup && mobileHTML5) {
if (sm2.setupOptions.ignoreMobileRestrictions) {
messages.push(strings.ignoreMobile);
} else {
if (!sm2.setupOptions.useHTML5Audio || sm2.setupOptions.preferFlash) {
sm2._wD(strings.mobileUA);
}
sm2.setupOptions.useHTML5Audio = true;
sm2.setupOptions.preferFlash = false;
if (is_iDevice) {
sm2.ignoreFlash = true;
} else if ((isAndroid && !ua.match(/android\s2\.3/i)) || !isAndroid) {
/**
* Android devices tend to work better with a single audio instance, specifically for chained playback of sounds in sequence.
* Common use case: exiting sound onfinish() -> createSound() -> play()
* Presuming similar restrictions for other mobile, non-Android, non-iOS devices.
*/
sm2._wD(strings.globalHTML5);
useGlobalHTML5Audio = true;
}
}
}
if (options) {
if (noURL && didDCLoaded && options.url !== _undefined) {
sm2.beginDelayedInit();
}
if (!didDCLoaded && options.url !== _undefined && doc.readyState === 'complete') {
setTimeout(domContentLoaded, 1);
}
}
didSetup = true;
return sm2;
};
this.ok = function() {
return (needsFlash ? (didInit && !disabled) : (sm2.useHTML5Audio && sm2.hasHTML5));
};
this.supported = this.ok; // legacy
this.getMovie = function(movie_id) {
return id(movie_id) || doc[movie_id] || window[movie_id];
};
/**
* Creates a SMSound sound object instance. Can also be overloaded, e.g., createSound('mySound', '/some.mp3');
*
* @param {object} oOptions Sound options (at minimum, url parameter is required.)
* @return {object} SMSound The new SMSound object.
*/
this.createSound = function(oOptions, _url) {
var cs, cs_string, options, oSound = null;
cs = sm + '.createSound(): ';
cs_string = cs + str(!didInit ? 'notReady' : 'notOK');
if (!didInit || !sm2.ok()) {
complain(cs_string);
return false;
}
if (_url !== _undefined) {
oOptions = {
id: oOptions,
url: _url
};
}
options = mixin(oOptions);
options.url = parseURL(options.url);
if (options.id === _undefined) {
options.id = sm2.setupOptions.idPrefix + (idCounter++);
}
if (options.id.toString().charAt(0).match(/^[0-9]$/)) {
sm2._wD(cs + str('badID', options.id), 2);
}
sm2._wD(cs + options.id + (options.url ? ' (' + options.url + ')' : ''), 1);
if (idCheck(options.id, true)) {
sm2._wD(cs + options.id + ' exists', 1);
return sm2.sounds[options.id];
}
function make() {
options = loopFix(options);
sm2.sounds[options.id] = new SMSound(options);
sm2.soundIDs.push(options.id);
return sm2.sounds[options.id];
}
if (html5OK(options)) {
oSound = make();
if (!sm2.html5Only) {
sm2._wD(options.id + ': Using HTML5');
}
oSound._setup_html5(options);
} else {
if (sm2.html5Only) {
sm2._wD(options.id + ': No HTML5 support for this sound, and no Flash. Exiting.');
return make();
}
if (sm2.html5.usingFlash && options.url && options.url.match(/data:/i)) {
sm2._wD(options.id + ': data: URIs not supported via Flash. Exiting.');
return make();
}
if (fV > 8) {
if (options.isMovieStar === null) {
options.isMovieStar = !!(options.serverURL || (options.type ? options.type.match(netStreamMimeTypes) : false) || (options.url && options.url.match(netStreamPattern)));
}
if (options.isMovieStar) {
sm2._wD(cs + 'using MovieStar handling');
if (options.loops > 1) {
_wDS('noNSLoop');
}
}
}
options = policyFix(options, cs);
oSound = make();
if (fV === 8) {
flash._createSound(options.id, options.loops || 1, options.usePolicyFile);
} else {
flash._createSound(options.id, options.url, options.usePeakData, options.useWaveformData, options.useEQData, options.isMovieStar, (options.isMovieStar ? options.bufferTime : false), options.loops || 1, options.serverURL, options.duration || null, options.autoPlay, true, options.autoLoad, options.usePolicyFile);
if (!options.serverURL) {
oSound.connected = true;
if (options.onconnect) {
options.onconnect.apply(oSound);
}
}
}
if (!options.serverURL && (options.autoLoad || options.autoPlay)) {
oSound.load(options);
}
}
if (!options.serverURL && options.autoPlay) {
oSound.play();
}
return oSound;
};
/**
* Destroys a SMSound sound object instance.
*
* @param {string} sID The ID of the sound to destroy
*/
this.destroySound = function(sID, _bFromSound) {
if (!idCheck(sID)) return false;
var oS = sm2.sounds[sID], i;
oS.stop();
oS._iO = {};
oS.unload();
for (i = 0; i < sm2.soundIDs.length; i++) {
if (sm2.soundIDs[i] === sID) {
sm2.soundIDs.splice(i, 1);
break;
}
}
if (!_bFromSound) {
oS.destruct(true);
}
oS = null;
delete sm2.sounds[sID];
return true;
};
/**
* Calls the load() method of a SMSound object by ID.
*
* @param {string} sID The ID of the sound
* @param {object} oOptions Optional: Sound options
*/
this.load = function(sID, oOptions) {
if (!idCheck(sID)) return false;
return sm2.sounds[sID].load(oOptions);
};
/**
* Calls the unload() method of a SMSound object by ID.
*
* @param {string} sID The ID of the sound
*/
this.unload = function(sID) {
if (!idCheck(sID)) return false;
return sm2.sounds[sID].unload();
};
/**
* Calls the onPosition() method of a SMSound object by ID.
*
* @param {string} sID The ID of the sound
* @param {number} nPosition The position to watch for
* @param {function} oMethod The relevant callback to fire
* @param {object} oScope Optional: The scope to apply the callback to
* @return {SMSound} The SMSound object
*/
this.onPosition = function(sID, nPosition, oMethod, oScope) {
if (!idCheck(sID)) return false;
return sm2.sounds[sID].onposition(nPosition, oMethod, oScope);
};
this.onposition = this.onPosition;
/**
* Calls the clearOnPosition() method of a SMSound object by ID.
*
* @param {string} sID The ID of the sound
* @param {number} nPosition The position to watch for
* @param {function} oMethod Optional: The relevant callback to fire
* @return {SMSound} The SMSound object
*/
this.clearOnPosition = function(sID, nPosition, oMethod) {
if (!idCheck(sID)) return false;
return sm2.sounds[sID].clearOnPosition(nPosition, oMethod);
};
/**
* Calls the play() method of a SMSound object by ID.
*
* @param {string} sID The ID of the sound
* @param {object} oOptions Optional: Sound options
* @return {SMSound} The SMSound object
*/
this.play = function(sID, oOptions) {
var result = null,
overloaded = (oOptions && !(oOptions instanceof Object));
if (!didInit || !sm2.ok()) {
complain(sm + '.play(): ' + str(!didInit ? 'notReady' : 'notOK'));
return false;
}
if (!idCheck(sID, overloaded)) {
if (!overloaded) return false;
if (overloaded) {
oOptions = {
url: oOptions
};
}
if (oOptions && oOptions.url) {
sm2._wD(sm + '.play(): Attempting to create "' + sID + '"', 1);
oOptions.id = sID;
result = sm2.createSound(oOptions).play();
}
} else if (overloaded) {
oOptions = {
url: oOptions
};
}
if (result === null) {
result = sm2.sounds[sID].play(oOptions);
}
return result;
};
this.start = this.play;
/**
* Calls the setPlaybackRate() method of a SMSound object by ID.
*
* @param {string} sID The ID of the sound
* @return {SMSound} The SMSound object
*/
this.setPlaybackRate = function(sID, rate, allowOverride) {
if (!idCheck(sID)) return false;
return sm2.sounds[sID].setPlaybackRate(rate, allowOverride);
};
/**
* Calls the setPosition() method of a SMSound object by ID.
*
* @param {string} sID The ID of the sound
* @param {number} nMsecOffset Position (milliseconds)
* @return {SMSound} The SMSound object
*/
this.setPosition = function(sID, nMsecOffset) {
if (!idCheck(sID)) return false;
return sm2.sounds[sID].setPosition(nMsecOffset);
};
/**
* Calls the stop() method of a SMSound object by ID.
*
* @param {string} sID The ID of the sound
* @return {SMSound} The SMSound object
*/
this.stop = function(sID) {
if (!idCheck(sID)) return false;
sm2._wD(sm + '.stop(' + sID + ')', 1);
return sm2.sounds[sID].stop();
};
/**
* Stops all currently-playing sounds.
*/
this.stopAll = function() {
var oSound;
sm2._wD(sm + '.stopAll()', 1);
for (oSound in sm2.sounds) {
if (sm2.sounds.hasOwnProperty(oSound)) {
sm2.sounds[oSound].stop();
}
}
};
/**
* Calls the pause() method of a SMSound object by ID.
*
* @param {string} sID The ID of the sound
* @return {SMSound} The SMSound object
*/
this.pause = function(sID) {
if (!idCheck(sID)) return false;
return sm2.sounds[sID].pause();
};
/**
* Pauses all currently-playing sounds.
*/
this.pauseAll = function() {
var i;
for (i = sm2.soundIDs.length - 1; i >= 0; i--) {
sm2.sounds[sm2.soundIDs[i]].pause();
}
};
/**
* Calls the resume() method of a SMSound object by ID.
*
* @param {string} sID The ID of the sound
* @return {SMSound} The SMSound object
*/
this.resume = function(sID) {
if (!idCheck(sID)) return false;
return sm2.sounds[sID].resume();
};
/**
* Resumes all currently-paused sounds.
*/
this.resumeAll = function() {
var i;
for (i = sm2.soundIDs.length - 1; i >= 0; i--) {
sm2.sounds[sm2.soundIDs[i]].resume();
}
};
/**
* Calls the togglePause() method of a SMSound object by ID.
*
* @param {string} sID The ID of the sound
* @return {SMSound} The SMSound object
*/
this.togglePause = function(sID) {
if (!idCheck(sID)) return false;
return sm2.sounds[sID].togglePause();
};
/**
* Calls the setPan() method of a SMSound object by ID.
*
* @param {string} sID The ID of the sound
* @param {number} nPan The pan value (-100 to 100)
* @return {SMSound} The SMSound object
*/
this.setPan = function(sID, nPan) {
if (!idCheck(sID)) return false;
return sm2.sounds[sID].setPan(nPan);
};
/**
* Calls the setVolume() method of a SMSound object by ID
* Overloaded case: pass only volume argument eg., setVolume(50) to apply to all sounds.
*
* @param {string} sID The ID of the sound
* @param {number} nVol The volume value (0 to 100)
* @return {SMSound} The SMSound object
*/
this.setVolume = function(sID, nVol) {
var i, j;
if (sID !== _undefined && !isNaN(sID) && nVol === _undefined) {
for (i = 0, j = sm2.soundIDs.length; i < j; i++) {
sm2.sounds[sm2.soundIDs[i]].setVolume(sID);
}
return false;
}
if (!idCheck(sID)) return false;
return sm2.sounds[sID].setVolume(nVol);
};
/**
* Calls the mute() method of either a single SMSound object by ID, or all sound objects.
*
* @param {string} sID Optional: The ID of the sound (if omitted, all sounds will be used.)
*/
this.mute = function(sID) {
var i = 0;
if (sID instanceof String) {
sID = null;
}
if (!sID) {
sm2._wD(sm + '.mute(): Muting all sounds');
for (i = sm2.soundIDs.length - 1; i >= 0; i--) {
sm2.sounds[sm2.soundIDs[i]].mute();
}
sm2.muted = true;
} else {
if (!idCheck(sID)) return false;
sm2._wD(sm + '.mute(): Muting "' + sID + '"');
return sm2.sounds[sID].mute();
}
return true;
};
/**
* Mutes all sounds.
*/
this.muteAll = function() {
sm2.mute();
};
/**
* Calls the unmute() method of either a single SMSound object by ID, or all sound objects.
*
* @param {string} sID Optional: The ID of the sound (if omitted, all sounds will be used.)
*/
this.unmute = function(sID) {
var i;
if (sID instanceof String) {
sID = null;
}
if (!sID) {
sm2._wD(sm + '.unmute(): Unmuting all sounds');
for (i = sm2.soundIDs.length - 1; i >= 0; i--) {
sm2.sounds[sm2.soundIDs[i]].unmute();
}
sm2.muted = false;
} else {
if (!idCheck(sID)) return false;
sm2._wD(sm + '.unmute(): Unmuting "' + sID + '"');
return sm2.sounds[sID].unmute();
}
return true;
};
/**
* Unmutes all sounds.
*/
this.unmuteAll = function() {
sm2.unmute();
};
/**
* Calls the toggleMute() method of a SMSound object by ID.
*
* @param {string} sID The ID of the sound
* @return {SMSound} The SMSound object
*/
this.toggleMute = function(sID) {
if (!idCheck(sID)) return false;
return sm2.sounds[sID].toggleMute();
};
/**
* Retrieves the memory used by the flash plugin.
*
* @return {number} The amount of memory in use
*/
this.getMemoryUse = function() {
var ram = 0;
if (flash && fV !== 8) {
ram = parseInt(flash._getMemoryUse(), 10);
}
return ram;
};
/**
* Undocumented: NOPs soundManager and all SMSound objects.
*/
this.disable = function(bNoDisable) {
var i;
if (bNoDisable === _undefined) {
bNoDisable = false;
}
if (disabled) return false;
disabled = true;
_wDS('shutdown', 1);
for (i = sm2.soundIDs.length - 1; i >= 0; i--) {
disableObject(sm2.sounds[sm2.soundIDs[i]]);
}
disableObject(sm2);
initComplete(bNoDisable);
event.remove(window, 'load', initUserOnload);
return true;
};
/**
* Determines playability of a MIME type, eg. 'audio/mp3'.
*/
this.canPlayMIME = function(sMIME) {
var result;
if (sm2.hasHTML5) {
result = html5CanPlay({
type: sMIME
});
}
if (!result && needsFlash) {
result = (sMIME && sm2.ok() ? !!((fV > 8 ? sMIME.match(netStreamMimeTypes) : null) || sMIME.match(sm2.mimePattern)) : null); // TODO: make less "weird" (per JSLint)
}
return result;
};
/**
* Determines playability of a URL based on audio support.
*
* @param {string} sURL The URL to test
* @return {boolean} URL playability
*/
this.canPlayURL = function(sURL) {
var result;
if (sm2.hasHTML5) {
result = html5CanPlay({
url: sURL
});
}
if (!result && needsFlash) {
result = (sURL && sm2.ok() ? !!(sURL.match(sm2.filePattern)) : null);
}
return result;
};
/**
* Determines playability of an HTML DOM &lt;a&gt; object (or similar object literal) based on audio support.
*
* @param {object} oLink an HTML DOM &lt;a&gt; object or object literal including href and/or type attributes
* @return {boolean} URL playability
*/
this.canPlayLink = function(oLink) {
if (oLink.type !== _undefined && oLink.type && sm2.canPlayMIME(oLink.type)) return true;
return sm2.canPlayURL(oLink.href);
};
/**
* Retrieves a SMSound object by ID.
*
* @param {string} sID The ID of the sound
* @return {SMSound} The SMSound object
*/
this.getSoundById = function(sID, _suppressDebug) {
if (!sID) return null;
var result = sm2.sounds[sID];
if (!result && !_suppressDebug) {
sm2._wD(sm + '.getSoundById(): Sound "' + sID + '" not found.', 2);
}
return result;
};
/**
* Queues a callback for execution when SoundManager has successfully initialized.
*
* @param {function} oMethod The callback method to fire
* @param {object} oScope Optional: The scope to apply to the callback
*/
this.onready = function(oMethod, oScope) {
var sType = 'onready',
result = false;
if (typeof oMethod === 'function') {
if (didInit) {
sm2._wD(str('queue', sType));
}
if (!oScope) {
oScope = window;
}
addOnEvent(sType, oMethod, oScope);
processOnEvents();
result = true;
} else {
throw str('needFunction', sType);
}
return result;
};
/**
* Queues a callback for execution when SoundManager has failed to initialize.
*
* @param {function} oMethod The callback method to fire
* @param {object} oScope Optional: The scope to apply to the callback
*/
this.ontimeout = function(oMethod, oScope) {
var sType = 'ontimeout',
result = false;
if (typeof oMethod === 'function') {
if (didInit) {
sm2._wD(str('queue', sType));
}
if (!oScope) {
oScope = window;
}
addOnEvent(sType, oMethod, oScope);
processOnEvents({ type: sType });
result = true;
} else {
throw str('needFunction', sType);
}
return result;
};
/**
* Writes console.log()-style debug output to a console or in-browser element.
* Applies when debugMode = true
*
* @param {string} sText The console message
* @param {object} nType Optional log level (number), or object. Number case: Log type/style where 0 = 'info', 1 = 'warn', 2 = 'error'. Object case: Object to be dumped.
*/
this._writeDebug = function(sText, sTypeOrObject) {
var sDID = 'soundmanager-debug', o, oItem;
if (!sm2.setupOptions.debugMode) return false;
if (hasConsole && sm2.useConsole) {
if (sTypeOrObject && typeof sTypeOrObject === 'object') {
console.log(sText, sTypeOrObject);
} else if (debugLevels[sTypeOrObject] !== _undefined) {
console[debugLevels[sTypeOrObject]](sText);
} else {
console.log(sText);
}
if (sm2.consoleOnly) return true;
}
o = id(sDID);
if (!o) return false;
oItem = doc.createElement('div');
if (++wdCount % 2 === 0) {
oItem.className = 'sm2-alt';
}
if (sTypeOrObject === _undefined) {
sTypeOrObject = 0;
} else {
sTypeOrObject = parseInt(sTypeOrObject, 10);
}
oItem.appendChild(doc.createTextNode(sText));
if (sTypeOrObject) {
if (sTypeOrObject >= 2) {
oItem.style.fontWeight = 'bold';
}
if (sTypeOrObject === 3) {
oItem.style.color = '#ff3333';
}
}
o.insertBefore(oItem, o.firstChild);
o = null;
return true;
};
if (wl.indexOf('sm2-debug=alert') !== -1) {
this._writeDebug = function(sText) {
window.alert(sText);
};
}
this._wD = this._writeDebug;
/**
* Provides debug / state information on all SMSound objects.
*/
this._debug = function() {
var i, j;
_wDS('currentObj', 1);
for (i = 0, j = sm2.soundIDs.length; i < j; i++) {
sm2.sounds[sm2.soundIDs[i]]._debug();
}
};
/**
* Restarts and re-initializes the SoundManager instance.
*
* @param {boolean} resetEvents Optional: When true, removes all registered onready and ontimeout event callbacks.
* @param {boolean} excludeInit Options: When true, does not call beginDelayedInit() (which would restart SM2).
* @return {object} soundManager The soundManager instance.
*/
this.reboot = function(resetEvents, excludeInit) {
if (sm2.soundIDs.length) {
sm2._wD('Destroying ' + sm2.soundIDs.length + ' SMSound object' + (sm2.soundIDs.length !== 1 ? 's' : '') + '...');
}
var i, j, k;
for (i = sm2.soundIDs.length - 1; i >= 0; i--) {
sm2.sounds[sm2.soundIDs[i]].destruct();
}
if (flash) {
try {
if (isIE) {
oRemovedHTML = flash.innerHTML;
}
oRemoved = flash.parentNode.removeChild(flash);
} catch(e) {
_wDS('badRemove', 2);
}
}
oRemovedHTML = oRemoved = needsFlash = flash = null;
sm2.enabled = didDCLoaded = didInit = waitingForEI = initPending = didAppend = appendSuccess = disabled = useGlobalHTML5Audio = sm2.swfLoaded = false;
sm2.soundIDs = [];
sm2.sounds = {};
idCounter = 0;
didSetup = false;
if (!resetEvents) {
for (i in on_queue) {
if (on_queue.hasOwnProperty(i)) {
for (j = 0, k = on_queue[i].length; j < k; j++) {
on_queue[i][j].fired = false;
}
}
}
} else {
on_queue = [];
}
if (!excludeInit) {
sm2._wD(sm + ': Rebooting...');
}
sm2.html5 = {
usingFlash: null
};
sm2.flash = {};
sm2.html5Only = false;
sm2.ignoreFlash = false;
window.setTimeout(function() {
if (!excludeInit) {
sm2.beginDelayedInit();
}
}, 20);
return sm2;
};
this.reset = function() {
/**
* Shuts down and restores the SoundManager instance to its original loaded state, without an explicit reboot. All onready/ontimeout handlers are removed.
* After this call, SM2 may be re-initialized via soundManager.beginDelayedInit().
* @return {object} soundManager The soundManager instance.
*/
_wDS('reset');
return sm2.reboot(true, true);
};
/**
* Undocumented: Determines the SM2 flash movie's load progress.
*
* @return {number or null} Percent loaded, or if invalid/unsupported, null.
*/
this.getMoviePercent = function() {
/**
* Interesting syntax notes...
* Flash/ExternalInterface (ActiveX/NPAPI) bridge methods are not typeof "function" nor instanceof Function, but are still valid.
* Furthermore, using (flash && flash.PercentLoaded) causes IE to throw "object doesn't support this property or method".
* Thus, 'in' syntax must be used.
*/
return (flash && 'PercentLoaded' in flash ? flash.PercentLoaded() : null);
};
/**
* Additional helper for manually invoking SM2's init process after DOM Ready / window.onload().
*/
this.beginDelayedInit = function() {
windowLoaded = true;
domContentLoaded();
setTimeout(function() {
if (initPending) return false;
createMovie();
initMovie();
initPending = true;
return true;
}, 20);
delayWaitForEI();
};
/**
* Destroys the SoundManager instance and all SMSound instances.
*/
this.destruct = function() {
sm2._wD(sm + '.destruct()');
sm2.disable(true);
};
/**
* SMSound() (sound object) constructor
* ------------------------------------
*
* @param {object} oOptions Sound options (id and url are required attributes)
* @return {SMSound} The new SMSound object
*/
SMSound = function(oOptions) {
var s = this, resetProperties, add_html5_events, remove_html5_events, stop_html5_timer, start_html5_timer, attachOnPosition, onplay_called = false, onPositionItems = [], onPositionFired = 0, detachOnPosition, applyFromTo, lastURL = null, lastHTML5State, urlOmitted;
lastHTML5State = {
duration: null,
time: null
};
this.id = oOptions.id;
this.sID = this.id;
this.url = oOptions.url;
this.options = mixin(oOptions);
this.instanceOptions = this.options;
this._iO = this.instanceOptions;
this.pan = this.options.pan;
this.volume = this.options.volume;
this.isHTML5 = false;
this._a = null;
urlOmitted = (!this.url);
/**
* SMSound() public methods
* ------------------------
*/
this.id3 = {};
/**
* Writes SMSound object parameters to debug console
*/
this._debug = function() {
sm2._wD(s.id + ': Merged options:', s.options);
};
/**
* Begins loading a sound per its *url*.
*
* @param {object} options Optional: Sound options
* @return {SMSound} The SMSound object
*/
this.load = function(options) {
var oSound = null, instanceOptions;
if (options !== _undefined) {
s._iO = mixin(options, s.options);
} else {
options = s.options;
s._iO = options;
if (lastURL && lastURL !== s.url) {
_wDS('manURL');
s._iO.url = s.url;
s.url = null;
}
}
if (!s._iO.url) {
s._iO.url = s.url;
}
s._iO.url = parseURL(s._iO.url);
s.instanceOptions = s._iO;
instanceOptions = s._iO;
sm2._wD(s.id + ': load (' + instanceOptions.url + ')');
if (!instanceOptions.url && !s.url) {
sm2._wD(s.id + ': load(): url is unassigned. Exiting.', 2);
return s;
}
if (!s.isHTML5 && fV === 8 && !s.url && !instanceOptions.autoPlay) {
sm2._wD(s.id + ': Flash 8 load() limitation: Wait for onload() before calling play().', 1);
}
if (instanceOptions.url === s.url && s.readyState !== 0 && s.readyState !== 2) {
_wDS('onURL', 1);
if (s.readyState === 3 && instanceOptions.onload) {
wrapCallback(s, function() {
instanceOptions.onload.apply(s, [(!!s.duration)]);
});
}
return s;
}
s.loaded = false;
s.readyState = 1;
s.playState = 0;
s.id3 = {};
if (html5OK(instanceOptions)) {
oSound = s._setup_html5(instanceOptions);
if (!oSound._called_load) {
s._html5_canplay = false;
if (s.url !== instanceOptions.url) {
sm2._wD(_wDS('manURL') + ': ' + instanceOptions.url);
s._a.src = instanceOptions.url;
s.setPosition(0);
}
s._a.autobuffer = 'auto';
s._a.preload = 'auto';
s._a._called_load = true;
} else {
sm2._wD(s.id + ': Ignoring request to load again');
}
} else {
if (sm2.html5Only) {
sm2._wD(s.id + ': No flash support. Exiting.');
return s;
}
if (s._iO.url && s._iO.url.match(/data:/i)) {
sm2._wD(s.id + ': data: URIs not supported via Flash. Exiting.');
return s;
}
try {
s.isHTML5 = false;
s._iO = policyFix(loopFix(instanceOptions));
if (s._iO.autoPlay && (s._iO.position || s._iO.from)) {
sm2._wD(s.id + ': Disabling autoPlay because of non-zero offset case');
s._iO.autoPlay = false;
}
instanceOptions = s._iO;
if (fV === 8) {
flash._load(s.id, instanceOptions.url, instanceOptions.stream, instanceOptions.autoPlay, instanceOptions.usePolicyFile);
} else {
flash._load(s.id, instanceOptions.url, !!(instanceOptions.stream), !!(instanceOptions.autoPlay), instanceOptions.loops || 1, !!(instanceOptions.autoLoad), instanceOptions.usePolicyFile);
}
} catch(e) {
_wDS('smError', 2);
debugTS('onload', false);
catchError({
type: 'SMSOUND_LOAD_JS_EXCEPTION',
fatal: true
});
}
}
s.url = instanceOptions.url;
return s;
};
/**
* Unloads a sound, canceling any open HTTP requests.
*
* @return {SMSound} The SMSound object
*/
this.unload = function() {
if (s.readyState !== 0) {
sm2._wD(s.id + ': unload()');
if (!s.isHTML5) {
if (fV === 8) {
flash._unload(s.id, emptyURL);
} else {
flash._unload(s.id);
}
} else {
stop_html5_timer();
if (s._a) {
s._a.pause();
lastURL = html5Unload(s._a);
}
}
resetProperties();
}
return s;
};
/**
* Unloads and destroys a sound.
*/
this.destruct = function(_bFromSM) {
sm2._wD(s.id + ': Destruct');
if (!s.isHTML5) {
s._iO.onfailure = null;
flash._destroySound(s.id);
} else {
stop_html5_timer();
if (s._a) {
s._a.pause();
html5Unload(s._a);
if (!useGlobalHTML5Audio) {
remove_html5_events();
}
s._a._s = null;
s._a = null;
}
}
if (!_bFromSM) {
sm2.destroySound(s.id, true);
}
};
/**
* Begins playing a sound.
*
* @param {object} options Optional: Sound options
* @return {SMSound} The SMSound object
*/
this.play = function(options, _updatePlayState) {
var fN, allowMulti, a, onready,
audioClone, onended, oncanplay,
startOK = true;
fN = s.id + ': play(): ';
_updatePlayState = (_updatePlayState === _undefined ? true : _updatePlayState);
if (!options) {
options = {};
}
if (s.url) {
s._iO.url = s.url;
}
s._iO = mixin(s._iO, s.options);
s._iO = mixin(options, s._iO);
s._iO.url = parseURL(s._iO.url);
s.instanceOptions = s._iO;
if (!s.isHTML5 && s._iO.serverURL && !s.connected) {
if (!s.getAutoPlay()) {
sm2._wD(fN + ' Netstream not connected yet - setting autoPlay');
s.setAutoPlay(true);
}
return s;
}
if (html5OK(s._iO)) {
s._setup_html5(s._iO);
start_html5_timer();
}
if (s.playState === 1 && !s.paused) {
allowMulti = s._iO.multiShot;
if (!allowMulti) {
sm2._wD(fN + 'Already playing (one-shot)', 1);
if (s.isHTML5) {
s.setPosition(s._iO.position);
}
return s;
}
sm2._wD(fN + 'Already playing (multi-shot)', 1);
}
if (options.url && options.url !== s.url) {
if (!s.readyState && !s.isHTML5 && fV === 8 && urlOmitted) {
urlOmitted = false;
} else {
s.load(s._iO);
}
}
if (!s.loaded) {
if (s.readyState === 0) {
sm2._wD(fN + 'Attempting to load');
if (!s.isHTML5 && !sm2.html5Only) {
s._iO.autoPlay = true;
s.load(s._iO);
} else if (s.isHTML5) {
s.load(s._iO);
} else {
sm2._wD(fN + 'Unsupported type. Exiting.');
return s;
}
s.instanceOptions = s._iO;
} else if (s.readyState === 2) {
sm2._wD(fN + 'Could not load - exiting', 2);
return s;
} else {
sm2._wD(fN + 'Loading - attempting to play...');
}
} else {
sm2._wD(fN.substr(0, fN.lastIndexOf(':')));
}
if (!s.isHTML5 && fV === 9 && s.position > 0 && s.position === s.duration) {
sm2._wD(fN + 'Sound at end, resetting to position: 0');
options.position = 0;
}
/**
* Streams will pause when their buffer is full if they are being loaded.
* In this case paused is true, but the song hasn't started playing yet.
* If we just call resume() the onplay() callback will never be called.
* So only call resume() if the position is > 0.
* Another reason is because options like volume won't have been applied yet.
* For normal sounds, just resume.
*/
if (s.paused && s.position >= 0 && (!s._iO.serverURL || s.position > 0)) {
sm2._wD(fN + 'Resuming from paused state', 1);
s.resume();
} else {
s._iO = mixin(options, s._iO);
/**
* Preload in the event of play() with position under Flash,
* or from/to parameters and non-RTMP case
*/
if (((!s.isHTML5 && s._iO.position !== null && s._iO.position > 0) || (s._iO.from !== null && s._iO.from > 0) || s._iO.to !== null) && s.instanceCount === 0 && s.playState === 0 && !s._iO.serverURL) {
onready = function() {
s._iO = mixin(options, s._iO);
s.play(s._iO);
};
if (s.isHTML5 && !s._html5_canplay) {
sm2._wD(fN + 'Beginning load for non-zero offset case');
s.load({
_oncanplay: onready
});
} else if (!s.isHTML5 && !s.loaded && (!s.readyState || s.readyState !== 2)) {
sm2._wD(fN + 'Preloading for non-zero offset case');
s.load({
onload: onready
});
}
s._iO = applyFromTo();
}
if (!s.instanceCount || s._iO.multiShotEvents || (s.isHTML5 && s._iO.multiShot && !useGlobalHTML5Audio) || (!s.isHTML5 && fV > 8 && !s.getAutoPlay())) {
s.instanceCount++;
}
if (s._iO.onposition && s.playState === 0) {
attachOnPosition(s);
}
s.playState = 1;
s.paused = false;
s.position = (s._iO.position !== _undefined && !isNaN(s._iO.position) ? s._iO.position : 0);
if (!s.isHTML5) {
s._iO = policyFix(loopFix(s._iO));
}
if (s._iO.onplay && _updatePlayState) {
s._iO.onplay.apply(s);
onplay_called = true;
}
s.setVolume(s._iO.volume, true);
s.setPan(s._iO.pan, true);
if (s._iO.playbackRate !== 1) {
s.setPlaybackRate(s._iO.playbackRate);
}
if (!s.isHTML5) {
startOK = flash._start(s.id, s._iO.loops || 1, (fV === 9 ? s.position : s.position / msecScale), s._iO.multiShot || false);
if (fV === 9 && !startOK) {
sm2._wD(fN + 'No sound hardware, or 32-sound ceiling hit', 2);
if (s._iO.onplayerror) {
s._iO.onplayerror.apply(s);
}
}
} else if (s.instanceCount < 2) {
start_html5_timer();
a = s._setup_html5();
s.setPosition(s._iO.position);
a.play();
} else {
sm2._wD(s.id + ': Cloning Audio() for instance #' + s.instanceCount + '...');
audioClone = new Audio(s._iO.url);
onended = function() {
event.remove(audioClone, 'ended', onended);
s._onfinish(s);
html5Unload(audioClone);
audioClone = null;
};
oncanplay = function() {
event.remove(audioClone, 'canplay', oncanplay);
try {
audioClone.currentTime = s._iO.position / msecScale;
} catch(err) {
complain(s.id + ': multiShot play() failed to apply position of ' + (s._iO.position / msecScale));
}
audioClone.play();
};
event.add(audioClone, 'ended', onended);
if (s._iO.volume !== _undefined) {
audioClone.volume = Math.max(0, Math.min(1, s._iO.volume / 100));
}
if (s.muted) {
audioClone.muted = true;
}
if (s._iO.position) {
event.add(audioClone, 'canplay', oncanplay);
} else {
audioClone.play();
}
}
}
return s;
};
this.start = this.play;
/**
* Stops playing a sound (and optionally, all sounds)
*
* @param {boolean} bAll Optional: Whether to stop all sounds
* @return {SMSound} The SMSound object
*/
this.stop = function(bAll) {
var instanceOptions = s._iO,
originalPosition;
if (s.playState === 1) {
sm2._wD(s.id + ': stop()');
s._onbufferchange(0);
s._resetOnPosition(0);
s.paused = false;
if (!s.isHTML5) {
s.playState = 0;
}
detachOnPosition();
if (instanceOptions.to) {
s.clearOnPosition(instanceOptions.to);
}
if (!s.isHTML5) {
flash._stop(s.id, bAll);
if (instanceOptions.serverURL) {
s.unload();
}
} else if (s._a) {
originalPosition = s.position;
s.setPosition(0);
s.position = originalPosition;
s._a.pause();
s.playState = 0;
s._onTimer();
stop_html5_timer();
}
s.instanceCount = 0;
s._iO = {};
if (instanceOptions.onstop) {
instanceOptions.onstop.apply(s);
}
}
return s;
};
/**
* Undocumented/internal: Sets autoPlay for RTMP.
*
* @param {boolean} autoPlay state
*/
this.setAutoPlay = function(autoPlay) {
sm2._wD(s.id + ': Autoplay turned ' + (autoPlay ? 'on' : 'off'));
s._iO.autoPlay = autoPlay;
if (!s.isHTML5) {
flash._setAutoPlay(s.id, autoPlay);
if (autoPlay) {
if (!s.instanceCount && s.readyState === 1) {
s.instanceCount++;
sm2._wD(s.id + ': Incremented instance count to ' + s.instanceCount);
}
}
}
};
/**
* Undocumented/internal: Returns the autoPlay boolean.
*
* @return {boolean} The current autoPlay value
*/
this.getAutoPlay = function() {
return s._iO.autoPlay;
};
/**
* Sets the playback rate of a sound (HTML5-only.)
*
* @param {number} playbackRate (+/-)
* @return {SMSound} The SMSound object
*/
this.setPlaybackRate = function(playbackRate) {
var normalizedRate = Math.max(0.5, Math.min(4, playbackRate));
if (normalizedRate !== playbackRate) {
sm2._wD(s.id + ': setPlaybackRate(' + playbackRate + '): limiting rate to ' + normalizedRate, 2);
}
if (s.isHTML5) {
try {
s._iO.playbackRate = normalizedRate;
s._a.playbackRate = normalizedRate;
} catch(e) {
sm2._wD(s.id + ': setPlaybackRate(' + normalizedRate + ') failed: ' + e.message, 2);
}
}
return s;
};
/**
* Sets the position of a sound.
*
* @param {number} nMsecOffset Position (milliseconds)
* @return {SMSound} The SMSound object
*/
this.setPosition = function(nMsecOffset) {
if (nMsecOffset === _undefined) {
nMsecOffset = 0;
}
var position, position1K,
offset = (s.isHTML5 ? Math.max(nMsecOffset, 0) : Math.min(s.duration || s._iO.duration, Math.max(nMsecOffset, 0)));
s.position = offset;
position1K = s.position / msecScale;
s._resetOnPosition(s.position);
s._iO.position = offset;
if (!s.isHTML5) {
position = (fV === 9 ? s.position : position1K);
if (s.readyState && s.readyState !== 2) {
flash._setPosition(s.id, position, (s.paused || !s.playState), s._iO.multiShot);
}
} else if (s._a) {
if (s._html5_canplay) {
if (s._a.currentTime.toFixed(3) !== position1K.toFixed(3)) {
/**
* DOM/JS errors/exceptions to watch out for:
* if seek is beyond (loaded?) position, "DOM exception 11"
* "INDEX_SIZE_ERR": DOM exception 1
*/
sm2._wD(s.id + ': setPosition(' + position1K + ')');
try {
s._a.currentTime = position1K;
if (s.playState === 0 || s.paused) {
s._a.pause();
}
} catch(e) {
sm2._wD(s.id + ': setPosition(' + position1K + ') failed: ' + e.message, 2);
}
}
} else if (position1K) {
sm2._wD(s.id + ': setPosition(' + position1K + '): Cannot seek yet, sound not ready', 2);
return s;
}
if (s.paused) {
s._onTimer(true);
}
}
return s;
};
/**
* Pauses sound playback.
*
* @return {SMSound} The SMSound object
*/
this.pause = function(_bCallFlash) {
if (s.paused || (s.playState === 0 && s.readyState !== 1)) return s;
sm2._wD(s.id + ': pause()');
s.paused = true;
if (!s.isHTML5) {
if (_bCallFlash || _bCallFlash === _undefined) {
flash._pause(s.id, s._iO.multiShot);
}
} else {
s._setup_html5().pause();
stop_html5_timer();
}
if (s._iO.onpause) {
s._iO.onpause.apply(s);
}
return s;
};
/**
* Resumes sound playback.
*
* @return {SMSound} The SMSound object
*/
/**
* When auto-loaded streams pause on buffer full they have a playState of 0.
* We need to make sure that the playState is set to 1 when these streams "resume".
* When a paused stream is resumed, we need to trigger the onplay() callback if it
* hasn't been called already. In this case since the sound is being played for the
* first time, I think it's more appropriate to call onplay() rather than onresume().
*/
this.resume = function() {
var instanceOptions = s._iO;
if (!s.paused) return s;
sm2._wD(s.id + ': resume()');
s.paused = false;
s.playState = 1;
if (!s.isHTML5) {
if (instanceOptions.isMovieStar && !instanceOptions.serverURL) {
s.setPosition(s.position);
}
flash._pause(s.id, instanceOptions.multiShot);
} else {
s._setup_html5().play();
start_html5_timer();
}
if (!onplay_called && instanceOptions.onplay) {
instanceOptions.onplay.apply(s);
onplay_called = true;
} else if (instanceOptions.onresume) {
instanceOptions.onresume.apply(s);
}
return s;
};
/**
* Toggles sound playback.
*
* @return {SMSound} The SMSound object
*/
this.togglePause = function() {
sm2._wD(s.id + ': togglePause()');
if (s.playState === 0) {
s.play({
position: (fV === 9 && !s.isHTML5 ? s.position : s.position / msecScale)
});
return s;
}
if (s.paused) {
s.resume();
} else {
s.pause();
}
return s;
};
/**
* Sets the panning (L-R) effect.
*
* @param {number} nPan The pan value (-100 to 100)
* @return {SMSound} The SMSound object
*/
this.setPan = function(nPan, bInstanceOnly) {
if (nPan === _undefined) {
nPan = 0;
}
if (bInstanceOnly === _undefined) {
bInstanceOnly = false;
}
if (!s.isHTML5) {
flash._setPan(s.id, nPan);
} // else { no HTML5 pan? }
s._iO.pan = nPan;
if (!bInstanceOnly) {
s.pan = nPan;
s.options.pan = nPan;
}
return s;
};
/**
* Sets the volume.
*
* @param {number} nVol The volume value (0 to 100)
* @return {SMSound} The SMSound object
*/
this.setVolume = function(nVol, _bInstanceOnly) {
/**
* Note: Setting volume has no effect on iOS "special snowflake" devices.
* Hardware volume control overrides software, and volume
* will always return 1 per Apple docs. (iOS 4 + 5.)
* http://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/AddingSoundtoCanvasAnimations/AddingSoundtoCanvasAnimations.html
*/
if (nVol === _undefined) {
nVol = 100;
}
if (_bInstanceOnly === _undefined) {
_bInstanceOnly = false;
}
if (!s.isHTML5) {
flash._setVolume(s.id, (sm2.muted && !s.muted) || s.muted ? 0 : nVol);
} else if (s._a) {
if (sm2.muted && !s.muted) {
s.muted = true;
s._a.muted = true;
}
s._a.volume = Math.max(0, Math.min(1, nVol / 100));
}
s._iO.volume = nVol;
if (!_bInstanceOnly) {
s.volume = nVol;
s.options.volume = nVol;
}
return s;
};
/**
* Mutes the sound.
*
* @return {SMSound} The SMSound object
*/
this.mute = function() {
s.muted = true;
if (!s.isHTML5) {
flash._setVolume(s.id, 0);
} else if (s._a) {
s._a.muted = true;
}
return s;
};
/**
* Unmutes the sound.
*
* @return {SMSound} The SMSound object
*/
this.unmute = function() {
s.muted = false;
var hasIO = (s._iO.volume !== _undefined);
if (!s.isHTML5) {
flash._setVolume(s.id, hasIO ? s._iO.volume : s.options.volume);
} else if (s._a) {
s._a.muted = false;
}
return s;
};
/**
* Toggles the muted state of a sound.
*
* @return {SMSound} The SMSound object
*/
this.toggleMute = function() {
return (s.muted ? s.unmute() : s.mute());
};
/**
* Registers a callback to be fired when a sound reaches a given position during playback.
*
* @param {number} nPosition The position to watch for
* @param {function} oMethod The relevant callback to fire
* @param {object} oScope Optional: The scope to apply the callback to
* @return {SMSound} The SMSound object
*/
this.onPosition = function(nPosition, oMethod, oScope) {
onPositionItems.push({
position: parseInt(nPosition, 10),
method: oMethod,
scope: (oScope !== _undefined ? oScope : s),
fired: false
});
return s;
};
this.onposition = this.onPosition;
/**
* Removes registered callback(s) from a sound, by position and/or callback.
*
* @param {number} nPosition The position to clear callback(s) for
* @param {function} oMethod Optional: Identify one callback to be removed when multiple listeners exist for one position
* @return {SMSound} The SMSound object
*/
this.clearOnPosition = function(nPosition, oMethod) {
var i;
nPosition = parseInt(nPosition, 10);
if (isNaN(nPosition)) {
return;
}
for (i = 0; i < onPositionItems.length; i++) {
if (nPosition === onPositionItems[i].position) {
if (!oMethod || (oMethod === onPositionItems[i].method)) {
if (onPositionItems[i].fired) {
onPositionFired--;
}
onPositionItems.splice(i, 1);
}
}
}
};
this._processOnPosition = function() {
var i, item, j = onPositionItems.length;
if (!j || !s.playState || onPositionFired >= j) return false;
for (i = j - 1; i >= 0; i--) {
item = onPositionItems[i];
if (!item.fired && s.position >= item.position) {
item.fired = true;
onPositionFired++;
item.method.apply(item.scope, [item.position]);
j = onPositionItems.length;
}
}
return true;
};
this._resetOnPosition = function(nPosition) {
var i, item, j = onPositionItems.length;
if (!j) return false;
for (i = j - 1; i >= 0; i--) {
item = onPositionItems[i];
if (item.fired && nPosition <= item.position) {
item.fired = false;
onPositionFired--;
}
}
return true;
};
/**
* SMSound() private internals
* --------------------------------
*/
applyFromTo = function() {
var instanceOptions = s._iO,
f = instanceOptions.from,
t = instanceOptions.to,
start, end;
end = function() {
sm2._wD(s.id + ': "To" time of ' + t + ' reached.');
s.clearOnPosition(t, end);
s.stop();
};
start = function() {
sm2._wD(s.id + ': Playing "from" ' + f);
if (t !== null && !isNaN(t)) {
s.onPosition(t, end);
}
};
if (f !== null && !isNaN(f)) {
instanceOptions.position = f;
instanceOptions.multiShot = false;
start();
}
return instanceOptions;
};
attachOnPosition = function() {
var item,
op = s._iO.onposition;
if (op) {
for (item in op) {
if (op.hasOwnProperty(item)) {
s.onPosition(parseInt(item, 10), op[item]);
}
}
}
};
detachOnPosition = function() {
var item,
op = s._iO.onposition;
if (op) {
for (item in op) {
if (op.hasOwnProperty(item)) {
s.clearOnPosition(parseInt(item, 10));
}
}
}
};
start_html5_timer = function() {
if (s.isHTML5) {
startTimer(s);
}
};
stop_html5_timer = function() {
if (s.isHTML5) {
stopTimer(s);
}
};
resetProperties = function(retainPosition) {
if (!retainPosition) {
onPositionItems = [];
onPositionFired = 0;
}
onplay_called = false;
s._hasTimer = null;
s._a = null;
s._html5_canplay = false;
s.bytesLoaded = null;
s.bytesTotal = null;
s.duration = (s._iO && s._iO.duration ? s._iO.duration : null);
s.durationEstimate = null;
s.buffered = [];
s.eqData = [];
s.eqData.left = [];
s.eqData.right = [];
s.failures = 0;
s.isBuffering = false;
s.instanceOptions = {};
s.instanceCount = 0;
s.loaded = false;
s.metadata = {};
s.readyState = 0;
s.muted = false;
s.paused = false;
s.peakData = {
left: 0,
right: 0
};
s.waveformData = {
left: [],
right: []
};
s.playState = 0;
s.position = null;
s.id3 = {};
};
resetProperties();
/**
* Pseudo-private SMSound internals
* --------------------------------
*/
this._onTimer = function(bForce) {
/**
* HTML5-only _whileplaying() etc.
* called from both HTML5 native events, and polling/interval-based timers
* mimics flash and fires only when time/duration change, so as to be polling-friendly
*/
var duration, isNew = false, time, x = {};
if (s._hasTimer || bForce) {
if (s._a && (bForce || ((s.playState > 0 || s.readyState === 1) && !s.paused))) {
duration = s._get_html5_duration();
if (duration !== lastHTML5State.duration) {
lastHTML5State.duration = duration;
s.duration = duration;
isNew = true;
}
s.durationEstimate = s.duration;
time = (s._a.currentTime * msecScale || 0);
if (time !== lastHTML5State.time) {
lastHTML5State.time = time;
isNew = true;
}
if (isNew || bForce) {
s._whileplaying(time, x, x, x, x);
}
}/* else {
return false;
}*/
}
return isNew;
};
this._get_html5_duration = function() {
var instanceOptions = s._iO,
d = (s._a && s._a.duration ? s._a.duration * msecScale : (instanceOptions && instanceOptions.duration ? instanceOptions.duration : null)),
result = (d && !isNaN(d) && d !== Infinity ? d : null);
return result;
};
this._apply_loop = function(a, nLoops) {
/**
* boolean instead of "loop", for webkit? - spec says string. http://www.w3.org/TR/html-markup/audio.html#audio.attrs.loop
* note that loop is either off or infinite under HTML5, unlike Flash which allows arbitrary loop counts to be specified.
*/
if (!a.loop && nLoops > 1) {
sm2._wD('Note: Native HTML5 looping is infinite.', 1);
}
a.loop = (nLoops > 1 ? 'loop' : '');
};
this._setup_html5 = function(options) {
var instanceOptions = mixin(s._iO, options),
a = useGlobalHTML5Audio ? globalHTML5Audio : s._a,
dURL = decodeURI(instanceOptions.url),
sameURL;
/**
* "First things first, I, Poppa..." (reset the previous state of the old sound, if playing)
* Fixes case with devices that can only play one sound at a time
* Otherwise, other sounds in mid-play will be terminated without warning and in a stuck state
*/
if (useGlobalHTML5Audio) {
if (dURL === decodeURI(lastGlobalHTML5URL)) {
sameURL = true;
}
} else if (dURL === decodeURI(lastURL)) {
sameURL = true;
}
if (a) {
if (a._s) {
if (useGlobalHTML5Audio) {
if (a._s && a._s.playState && !sameURL) {
a._s.stop();
}
} else if (!useGlobalHTML5Audio && dURL === decodeURI(lastURL)) {
s._apply_loop(a, instanceOptions.loops);
return a;
}
}
if (!sameURL) {
if (lastURL) {
resetProperties(false);
}
a.src = instanceOptions.url;
s.url = instanceOptions.url;
lastURL = instanceOptions.url;
lastGlobalHTML5URL = instanceOptions.url;
a._called_load = false;
}
} else {
if (instanceOptions.autoLoad || instanceOptions.autoPlay) {
s._a = new Audio(instanceOptions.url);
s._a.load();
} else {
s._a = (isOpera && opera.version() < 10 ? new Audio(null) : new Audio());
}
a = s._a;
a._called_load = false;
if (useGlobalHTML5Audio) {
globalHTML5Audio = a;
}
}
s.isHTML5 = true;
s._a = a;
a._s = s;
add_html5_events();
s._apply_loop(a, instanceOptions.loops);
if (instanceOptions.autoLoad || instanceOptions.autoPlay) {
s.load();
} else {
a.autobuffer = false;
a.preload = 'auto';
}
return a;
};
add_html5_events = function() {
if (s._a._added_events) return false;
var f;
function add(oEvt, oFn, bCapture) {
return s._a ? s._a.addEventListener(oEvt, oFn, bCapture || false) : null;
}
s._a._added_events = true;
for (f in html5_events) {
if (html5_events.hasOwnProperty(f)) {
add(f, html5_events[f]);
}
}
return true;
};
remove_html5_events = function() {
var f;
function remove(oEvt, oFn, bCapture) {
return (s._a ? s._a.removeEventListener(oEvt, oFn, bCapture || false) : null);
}
sm2._wD(s.id + ': Removing event listeners');
s._a._added_events = false;
for (f in html5_events) {
if (html5_events.hasOwnProperty(f)) {
remove(f, html5_events[f]);
}
}
};
/**
* Pseudo-private event internals
* ------------------------------
*/
this._onload = function(nSuccess) {
var fN,
loadOK = !!nSuccess || (!s.isHTML5 && fV === 8 && s.duration);
fN = s.id + ': ';
sm2._wD(fN + (loadOK ? 'onload()' : 'Failed to load / invalid sound?' + (!s.duration ? ' Zero-length duration reported.' : ' -') + ' (' + s.url + ')'), (loadOK ? 1 : 2));
if (!loadOK && !s.isHTML5) {
if (sm2.sandbox.noRemote === true) {
sm2._wD(fN + str('noNet'), 1);
}
if (sm2.sandbox.noLocal === true) {
sm2._wD(fN + str('noLocal'), 1);
}
}
s.loaded = loadOK;
s.readyState = (loadOK ? 3 : 2);
s._onbufferchange(0);
if (!loadOK && !s.isHTML5) {
s._onerror();
}
if (s._iO.onload) {
wrapCallback(s, function() {
s._iO.onload.apply(s, [loadOK]);
});
}
return true;
};
this._onerror = function(errorCode, description) {
if (s._iO.onerror) {
wrapCallback(s, function() {
s._iO.onerror.apply(s, [errorCode, description]);
});
}
};
this._onbufferchange = function(nIsBuffering) {
if (s.playState === 0) return false;
if ((nIsBuffering && s.isBuffering) || (!nIsBuffering && !s.isBuffering)) return false;
s.isBuffering = (nIsBuffering === 1);
if (s._iO.onbufferchange) {
sm2._wD(s.id + ': Buffer state change: ' + nIsBuffering);
s._iO.onbufferchange.apply(s, [nIsBuffering]);
}
return true;
};
/**
* Playback may have stopped due to buffering, or related reason.
* This state can be encountered on iOS < 6 when auto-play is blocked.
*/
this._onsuspend = function() {
if (s._iO.onsuspend) {
sm2._wD(s.id + ': Playback suspended');
s._iO.onsuspend.apply(s);
}
return true;
};
/**
* flash 9/movieStar + RTMP-only method, should fire only once at most
* at this point we just recreate failed sounds rather than trying to reconnect
*/
this._onfailure = function(msg, level, code) {
s.failures++;
sm2._wD(s.id + ': Failure (' + s.failures + '): ' + msg);
if (s._iO.onfailure && s.failures === 1) {
s._iO.onfailure(msg, level, code);
} else {
sm2._wD(s.id + ': Ignoring failure');
}
};
/**
* flash 9/movieStar + RTMP-only method for unhandled warnings/exceptions from Flash
* e.g., RTMP "method missing" warning (non-fatal) for getStreamLength on server
*/
this._onwarning = function(msg, level, code) {
if (s._iO.onwarning) {
s._iO.onwarning(msg, level, code);
}
};
this._onfinish = function() {
var io_onfinish = s._iO.onfinish;
s._onbufferchange(0);
s._resetOnPosition(0);
if (s.instanceCount) {
s.instanceCount--;
if (!s.instanceCount) {
detachOnPosition();
s.playState = 0;
s.paused = false;
s.instanceCount = 0;
s.instanceOptions = {};
s._iO = {};
stop_html5_timer();
if (s.isHTML5) {
s.position = 0;
}
}
if (!s.instanceCount || s._iO.multiShotEvents) {
if (io_onfinish) {
sm2._wD(s.id + ': onfinish()');
wrapCallback(s, function() {
io_onfinish.apply(s);
});
}
}
}
};
this._whileloading = function(nBytesLoaded, nBytesTotal, nDuration, nBufferLength) {
var instanceOptions = s._iO;
s.bytesLoaded = nBytesLoaded;
s.bytesTotal = nBytesTotal;
s.duration = Math.floor(nDuration);
s.bufferLength = nBufferLength;
if (!s.isHTML5 && !instanceOptions.isMovieStar) {
if (instanceOptions.duration) {
s.durationEstimate = (s.duration > instanceOptions.duration) ? s.duration : instanceOptions.duration;
} else {
s.durationEstimate = parseInt((s.bytesTotal / s.bytesLoaded) * s.duration, 10);
}
} else {
s.durationEstimate = s.duration;
}
if (!s.isHTML5) {
s.buffered = [{
start: 0,
end: s.duration
}];
}
if ((s.readyState !== 3 || s.isHTML5) && instanceOptions.whileloading) {
instanceOptions.whileloading.apply(s);
}
};
this._whileplaying = function(nPosition, oPeakData, oWaveformDataLeft, oWaveformDataRight, oEQData) {
var instanceOptions = s._iO,
eqLeft;
if (isNaN(nPosition) || nPosition === null) return false;
s.position = Math.max(0, nPosition);
s._processOnPosition();
if (!s.isHTML5 && fV > 8) {
if (instanceOptions.usePeakData && oPeakData !== _undefined && oPeakData) {
s.peakData = {
left: oPeakData.leftPeak,
right: oPeakData.rightPeak
};
}
if (instanceOptions.useWaveformData && oWaveformDataLeft !== _undefined && oWaveformDataLeft) {
s.waveformData = {
left: oWaveformDataLeft.split(','),
right: oWaveformDataRight.split(',')
};
}
if (instanceOptions.useEQData) {
if (oEQData !== _undefined && oEQData && oEQData.leftEQ) {
eqLeft = oEQData.leftEQ.split(',');
s.eqData = eqLeft;
s.eqData.left = eqLeft;
if (oEQData.rightEQ !== _undefined && oEQData.rightEQ) {
s.eqData.right = oEQData.rightEQ.split(',');
}
}
}
}
if (s.playState === 1) {
if (!s.isHTML5 && fV === 8 && !s.position && s.isBuffering) {
s._onbufferchange(0);
}
if (instanceOptions.whileplaying) {
instanceOptions.whileplaying.apply(s);
}
}
return true;
};
this._oncaptiondata = function(oData) {
/**
* internal: flash 9 + NetStream (MovieStar/RTMP-only) feature
*
* @param {object} oData
*/
sm2._wD(s.id + ': Caption data received.');
s.captiondata = oData;
if (s._iO.oncaptiondata) {
s._iO.oncaptiondata.apply(s, [oData]);
}
};
this._onmetadata = function(oMDProps, oMDData) {
/**
* internal: flash 9 + NetStream (MovieStar/RTMP-only) feature
* RTMP may include song title, MovieStar content may include encoding info
*
* @param {array} oMDProps (names)
* @param {array} oMDData (values)
*/
sm2._wD(s.id + ': Metadata received.');
var oData = {}, i, j;
for (i = 0, j = oMDProps.length; i < j; i++) {
oData[oMDProps[i]] = oMDData[i];
}
s.metadata = oData;
if (s._iO.onmetadata) {
s._iO.onmetadata.call(s, s.metadata);
}
};
this._onid3 = function(oID3Props, oID3Data) {
/**
* internal: flash 8 + flash 9 ID3 feature
* may include artist, song title etc.
*
* @param {array} oID3Props (names)
* @param {array} oID3Data (values)
*/
sm2._wD(s.id + ': ID3 data received.');
var oData = [], i, j;
for (i = 0, j = oID3Props.length; i < j; i++) {
oData[oID3Props[i]] = oID3Data[i];
}
s.id3 = mixin(s.id3, oData);
if (s._iO.onid3) {
s._iO.onid3.apply(s);
}
};
this._onconnect = function(bSuccess) {
bSuccess = (bSuccess === 1);
sm2._wD(s.id + ': ' + (bSuccess ? 'Connected.' : 'Failed to connect? - ' + s.url), (bSuccess ? 1 : 2));
s.connected = bSuccess;
if (bSuccess) {
s.failures = 0;
if (idCheck(s.id)) {
if (s.getAutoPlay()) {
s.play(_undefined, s.getAutoPlay());
} else if (s._iO.autoLoad) {
s.load();
}
}
if (s._iO.onconnect) {
s._iO.onconnect.apply(s, [bSuccess]);
}
}
};
this._ondataerror = function(sError) {
if (s.playState > 0) {
sm2._wD(s.id + ': Data error: ' + sError);
if (s._iO.ondataerror) {
s._iO.ondataerror.apply(s);
}
}
};
this._debug();
}; // SMSound()
/**
* Private SoundManager internals
* ------------------------------
*/
getDocument = function() {
return (doc.body || doc.getElementsByTagName('div')[0]);
};
id = function(sID) {
return doc.getElementById(sID);
};
mixin = function(oMain, oAdd) {
var o1 = (oMain || {}), o2, o;
o2 = (oAdd === _undefined ? sm2.defaultOptions : oAdd);
for (o in o2) {
if (o2.hasOwnProperty(o) && o1[o] === _undefined) {
if (typeof o2[o] !== 'object' || o2[o] === null) {
o1[o] = o2[o];
} else {
o1[o] = mixin(o1[o], o2[o]);
}
}
}
return o1;
};
wrapCallback = function(oSound, callback) {
/**
* 03/03/2013: Fix for Flash Player 11.6.602.171 + Flash 8 (flashVersion = 8) SWF issue
* setTimeout() fix for certain SMSound callbacks like onload() and onfinish(), where subsequent calls like play() and load() fail when Flash Player 11.6.602.171 is installed, and using soundManager with flashVersion = 8 (which is the default).
* Not sure of exact cause. Suspect race condition and/or invalid (NaN-style) position argument trickling down to the next JS -> Flash _start() call, in the play() case.
* Fix: setTimeout() to yield, plus safer null / NaN checking on position argument provided to Flash.
* https://getsatisfaction.com/schillmania/topics/recent_chrome_update_seems_to_have_broken_my_sm2_audio_player
*/
if (!oSound.isHTML5 && fV === 8) {
window.setTimeout(callback, 0);
} else {
callback();
}
};
extraOptions = {
onready: 1,
ontimeout: 1,
defaultOptions: 1,
flash9Options: 1,
movieStarOptions: 1
};
assign = function(o, oParent) {
/**
* recursive assignment of properties, soundManager.setup() helper
* allows property assignment based on whitelist
*/
var i,
result = true,
hasParent = (oParent !== _undefined),
setupOptions = sm2.setupOptions,
bonusOptions = extraOptions;
if (o === _undefined) {
result = [];
for (i in setupOptions) {
if (setupOptions.hasOwnProperty(i)) {
result.push(i);
}
}
for (i in bonusOptions) {
if (bonusOptions.hasOwnProperty(i)) {
if (typeof sm2[i] === 'object') {
result.push(i + ': {...}');
} else if (sm2[i] instanceof Function) {
result.push(i + ': function() {...}');
} else {
result.push(i);
}
}
}
sm2._wD(str('setup', result.join(', ')));
return false;
}
for (i in o) {
if (o.hasOwnProperty(i)) {
if (typeof o[i] !== 'object' || o[i] === null || o[i] instanceof Array || o[i] instanceof RegExp) {
if (hasParent && bonusOptions[oParent] !== _undefined) {
sm2[oParent][i] = o[i];
} else if (setupOptions[i] !== _undefined) {
sm2.setupOptions[i] = o[i];
sm2[i] = o[i];
} else if (bonusOptions[i] === _undefined) {
complain(str((sm2[i] === _undefined ? 'setupUndef' : 'setupError'), i), 2);
result = false;
} else if (sm2[i] instanceof Function) {
/**
* valid extraOptions (bonusOptions) parameter.
* is it a method, like onready/ontimeout? call it.
* multiple parameters should be in an array, eg. soundManager.setup({onready: [myHandler, myScope]});
*/
sm2[i].apply(sm2, (o[i] instanceof Array ? o[i] : [o[i]]));
} else {
sm2[i] = o[i];
}
} else if (bonusOptions[i] === _undefined) {
complain(str((sm2[i] === _undefined ? 'setupUndef' : 'setupError'), i), 2);
result = false;
} else {
return assign(o[i], i);
}
}
}
return result;
};
function preferFlashCheck(kind) {
return (sm2.preferFlash && hasFlash && !sm2.ignoreFlash && (sm2.flash[kind] !== _undefined && sm2.flash[kind]));
}
/**
* Internal DOM2-level event helpers
* ---------------------------------
*/
event = (function() {
var old = (window.attachEvent),
evt = {
add: (old ? 'attachEvent' : 'addEventListener'),
remove: (old ? 'detachEvent' : 'removeEventListener')
};
function getArgs(oArgs) {
var args = slice.call(oArgs),
len = args.length;
if (old) {
args[1] = 'on' + args[1];
if (len > 3) {
args.pop();
}
} else if (len === 3) {
args.push(false);
}
return args;
}
function apply(args, sType) {
var element = args.shift(),
method = [evt[sType]];
if (old) {
element[method](args[0], args[1]);
} else {
element[method].apply(element, args);
}
}
function add() {
apply(getArgs(arguments), 'add');
}
function remove() {
apply(getArgs(arguments), 'remove');
}
return {
add: add,
remove: remove
};
}());
/**
* Internal HTML5 event handling
* -----------------------------
*/
function html5_event(oFn) {
return function(e) {
var s = this._s,
result;
if (!s || !s._a) {
if (s && s.id) {
sm2._wD(s.id + ': Ignoring ' + e.type);
} else {
sm2._wD(h5 + 'Ignoring ' + e.type);
}
result = null;
} else {
result = oFn.call(this, e);
}
return result;
};
}
html5_events = {
abort: html5_event(function() {
sm2._wD(this._s.id + ': abort');
}),
canplay: html5_event(function() {
var s = this._s,
position1K;
if (s._html5_canplay) {
return;
}
s._html5_canplay = true;
sm2._wD(s.id + ': canplay');
s._onbufferchange(0);
position1K = (s._iO.position !== _undefined && !isNaN(s._iO.position) ? s._iO.position / msecScale : null);
if (this.currentTime !== position1K) {
sm2._wD(s.id + ': canplay: Setting position to ' + position1K);
try {
this.currentTime = position1K;
} catch(ee) {
sm2._wD(s.id + ': canplay: Setting position of ' + position1K + ' failed: ' + ee.message, 2);
}
}
if (s._iO._oncanplay) {
s._iO._oncanplay();
}
}),
canplaythrough: html5_event(function() {
var s = this._s;
if (!s.loaded) {
s._onbufferchange(0);
s._whileloading(s.bytesLoaded, s.bytesTotal, s._get_html5_duration());
s._onload(true);
}
}),
durationchange: html5_event(function() {
var s = this._s,
duration;
duration = s._get_html5_duration();
if (!isNaN(duration) && duration !== s.duration) {
sm2._wD(this._s.id + ': durationchange (' + duration + ')' + (s.duration ? ', previously ' + s.duration : ''));
s.durationEstimate = s.duration = duration;
}
}),
/*
emptied: html5_event(function() {
sm2._wD(this._s.id + ': emptied');
}),
*/
ended: html5_event(function() {
var s = this._s;
sm2._wD(s.id + ': ended');
s._onfinish();
}),
error: html5_event(function() {
var description = (html5ErrorCodes[this.error.code] || null);
sm2._wD(this._s.id + ': HTML5 error, code ' + this.error.code + (description ? ' (' + description + ')' : ''));
this._s._onload(false);
this._s._onerror(this.error.code, description);
}),
loadeddata: html5_event(function() {
var s = this._s;
sm2._wD(s.id + ': loadeddata');
if (!s._loaded && !isSafari) {
s.duration = s._get_html5_duration();
}
}),
loadedmetadata: html5_event(function() {
sm2._wD(this._s.id + ': loadedmetadata');
}),
loadstart: html5_event(function() {
sm2._wD(this._s.id + ': loadstart');
this._s._onbufferchange(1);
}),
play: html5_event(function() {
this._s._onbufferchange(0);
}),
playing: html5_event(function() {
sm2._wD(this._s.id + ': playing ' + String.fromCharCode(9835));
this._s._onbufferchange(0);
}),
progress: html5_event(function(e) {
var s = this._s,
i, j, progStr, buffered = 0,
isProgress = (e.type === 'progress'),
ranges = e.target.buffered,
loaded = (e.loaded || 0),
total = (e.total || 1);
s.buffered = [];
if (ranges && ranges.length) {
for (i = 0, j = ranges.length; i < j; i++) {
s.buffered.push({
start: ranges.start(i) * msecScale,
end: ranges.end(i) * msecScale
});
}
buffered = (ranges.end(0) - ranges.start(0)) * msecScale;
loaded = Math.min(1, buffered / (e.target.duration * msecScale));
if (isProgress && ranges.length > 1) {
progStr = [];
j = ranges.length;
for (i = 0; i < j; i++) {
progStr.push((e.target.buffered.start(i) * msecScale) + '-' + (e.target.buffered.end(i) * msecScale));
}
sm2._wD(this._s.id + ': progress, timeRanges: ' + progStr.join(', '));
}
if (isProgress && !isNaN(loaded)) {
sm2._wD(this._s.id + ': progress, ' + Math.floor(loaded * 100) + '% loaded');
}
}
if (!isNaN(loaded)) {
s._whileloading(loaded, total, s._get_html5_duration());
if (loaded && total && loaded === total) {
html5_events.canplaythrough.call(this, e);
}
}
}),
ratechange: html5_event(function() {
sm2._wD(this._s.id + ': ratechange');
}),
suspend: html5_event(function(e) {
var s = this._s;
sm2._wD(this._s.id + ': suspend');
html5_events.progress.call(this, e);
s._onsuspend();
}),
stalled: html5_event(function() {
sm2._wD(this._s.id + ': stalled');
}),
timeupdate: html5_event(function() {
this._s._onTimer();
}),
waiting: html5_event(function() {
var s = this._s;
sm2._wD(this._s.id + ': waiting');
s._onbufferchange(1);
})
};
html5OK = function(iO) {
var result;
if (!iO || (!iO.type && !iO.url && !iO.serverURL)) {
result = false;
} else if (iO.serverURL || (iO.type && preferFlashCheck(iO.type))) {
result = false;
} else {
result = ((iO.type ? html5CanPlay({ type: iO.type }) : html5CanPlay({ url: iO.url }) || sm2.html5Only || iO.url.match(/data:/i)));
}
return result;
};
html5Unload = function(oAudio) {
/**
* Internal method: Unload media, and cancel any current/pending network requests.
* Firefox can load an empty URL, which allegedly destroys the decoder and stops the download.
* https://developer.mozilla.org/En/Using_audio_and_video_in_Firefox#Stopping_the_download_of_media
* However, Firefox has been seen loading a relative URL from '' and thus requesting the hosting page on unload.
* Other UA behaviour is unclear, so everyone else gets an about:blank-style URL.
*/
var url;
if (oAudio) {
url = (isSafari ? emptyURL : (sm2.html5.canPlayType('audio/wav') ? emptyWAV : emptyURL));
oAudio.src = url;
if (oAudio._called_unload !== _undefined) {
oAudio._called_load = false;
}
}
if (useGlobalHTML5Audio) {
lastGlobalHTML5URL = null;
}
return url;
};
html5CanPlay = function(o) {
/**
* Try to find MIME, test and return truthiness
* o = {
*  url: '/path/to/an.mp3',
*  type: 'audio/mp3'
* }
*/
if (!sm2.useHTML5Audio || !sm2.hasHTML5) return false;
var url = (o.url || null),
mime = (o.type || null),
aF = sm2.audioFormats,
result,
offset,
fileExt,
item;
if (mime && sm2.html5[mime] !== _undefined) return (sm2.html5[mime] && !preferFlashCheck(mime));
if (!html5Ext) {
html5Ext = [];
for (item in aF) {
if (aF.hasOwnProperty(item)) {
html5Ext.push(item);
if (aF[item].related) {
html5Ext = html5Ext.concat(aF[item].related);
}
}
}
html5Ext = new RegExp('\\.(' + html5Ext.join('|') + ')(\\?.*)?$', 'i');
}
fileExt = (url ? url.toLowerCase().match(html5Ext) : null);
if (!fileExt || !fileExt.length) {
if (!mime) {
result = false;
} else {
offset = mime.indexOf(';');
fileExt = (offset !== -1 ? mime.substr(0, offset) : mime).substr(6);
}
} else {
fileExt = fileExt[1];
}
if (fileExt && sm2.html5[fileExt] !== _undefined) {
result = (sm2.html5[fileExt] && !preferFlashCheck(fileExt));
} else {
mime = 'audio/' + fileExt;
result = sm2.html5.canPlayType({ type: mime });
sm2.html5[fileExt] = result;
result = (result && sm2.html5[mime] && !preferFlashCheck(mime));
}
return result;
};
testHTML5 = function() {
/**
* Internal: Iterates over audioFormats, determining support eg. audio/mp3, audio/mpeg and so on
* assigns results to html5[] and flash[].
*/
if (!sm2.useHTML5Audio || !sm2.hasHTML5) {
sm2.html5.usingFlash = true;
needsFlash = true;
return false;
}
var a = (Audio !== _undefined ? (isOpera && opera.version() < 10 ? new Audio(null) : new Audio()) : null),
item, lookup, support = {}, aF, i;
function cp(m) {
var canPlay, j,
result = false,
isOK = false;
if (!a || typeof a.canPlayType !== 'function') return result;
if (m instanceof Array) {
for (i = 0, j = m.length; i < j; i++) {
if (sm2.html5[m[i]] || a.canPlayType(m[i]).match(sm2.html5Test)) {
isOK = true;
sm2.html5[m[i]] = true;
sm2.flash[m[i]] = !!(m[i].match(flashMIME));
}
}
result = isOK;
} else {
canPlay = (a && typeof a.canPlayType === 'function' ? a.canPlayType(m) : false);
result = !!(canPlay && (canPlay.match(sm2.html5Test)));
}
return result;
}
aF = sm2.audioFormats;
for (item in aF) {
if (aF.hasOwnProperty(item)) {
lookup = 'audio/' + item;
support[item] = cp(aF[item].type);
support[lookup] = support[item];
if (item.match(flashMIME)) {
sm2.flash[item] = true;
sm2.flash[lookup] = true;
} else {
sm2.flash[item] = false;
sm2.flash[lookup] = false;
}
if (aF[item] && aF[item].related) {
for (i = aF[item].related.length - 1; i >= 0; i--) {
support['audio/' + aF[item].related[i]] = support[item];
sm2.html5[aF[item].related[i]] = support[item];
sm2.flash[aF[item].related[i]] = support[item];
}
}
}
}
support.canPlayType = (a ? cp : null);
sm2.html5 = mixin(sm2.html5, support);
sm2.html5.usingFlash = featureCheck();
needsFlash = sm2.html5.usingFlash;
return true;
};
strings = {
notReady: 'Unavailable - wait until onready() has fired.',
notOK: 'Audio support is not available.',
domError: sm + 'exception caught while appending SWF to DOM.',
spcWmode: 'Removing wmode, preventing known SWF loading issue(s)',
swf404: smc + 'Verify that %s is a valid path.',
tryDebug: 'Try ' + sm + '.debugFlash = true for more security details (output goes to SWF.)',
checkSWF: 'See SWF output for more debug info.',
localFail: smc + 'Non-HTTP page (' + doc.location.protocol + ' URL?) Review Flash player security settings for this special case:\nhttp://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html\nMay need to add/allow path, eg. c:/sm2/ or /users/me/sm2/',
waitFocus: smc + 'Special case: Waiting for SWF to load with window focus...',
waitForever: smc + 'Waiting indefinitely for Flash (will recover if unblocked)...',
waitSWF: smc + 'Waiting for 100% SWF load...',
needFunction: smc + 'Function object expected for %s',
badID: 'Sound ID "%s" should be a string, starting with a non-numeric character',
currentObj: smc + '_debug(): Current sound objects',
waitOnload: smc + 'Waiting for window.onload()',
docLoaded: smc + 'Document already loaded',
onload: smc + 'initComplete(): calling soundManager.onload()',
onloadOK: sm + '.onload() complete',
didInit: smc + 'init(): Already called?',
secNote: 'Flash security note: Network/internet URLs will not load due to security restrictions. Access can be configured via Flash Player Global Security Settings Page: http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html',
badRemove: smc + 'Failed to remove Flash node.',
shutdown: sm + '.disable(): Shutting down',
queue: smc + 'Queueing %s handler',
smError: 'SMSound.load(): Exception: JS-Flash communication failed, or JS error.',
fbTimeout: 'No flash response, applying .' + swfCSS.swfTimedout + ' CSS...',
fbLoaded: 'Flash loaded',
fbHandler: smc + 'flashBlockHandler()',
manURL: 'SMSound.load(): Using manually-assigned URL',
onURL: sm + '.load(): current URL already assigned.',
badFV: sm + '.flashVersion must be 8 or 9. "%s" is invalid. Reverting to %s.',
as2loop: 'Note: Setting stream:false so looping can work (flash 8 limitation)',
noNSLoop: 'Note: Looping not implemented for MovieStar formats',
needfl9: 'Note: Switching to flash 9, required for MP4 formats.',
mfTimeout: 'Setting flashLoadTimeout = 0 (infinite) for off-screen, mobile flash case',
needFlash: smc + 'Fatal error: Flash is needed to play some required formats, but is not available.',
gotFocus: smc + 'Got window focus.',
policy: 'Enabling usePolicyFile for data access',
setup: sm + '.setup(): allowed parameters: %s',
setupError: sm + '.setup(): "%s" cannot be assigned with this method.',
setupUndef: sm + '.setup(): Could not find option "%s"',
setupLate: sm + '.setup(): url, flashVersion and html5Test property changes will not take effect until reboot().',
noURL: smc + 'Flash URL required. Call soundManager.setup({url:...}) to get started.',
sm2Loaded: 'SoundManager 2: Ready. ' + String.fromCharCode(10003),
reset: sm + '.reset(): Removing event callbacks',
mobileUA: 'Mobile UA detected, preferring HTML5 by default.',
globalHTML5: 'Using singleton HTML5 Audio() pattern for this device.',
ignoreMobile: 'Ignoring mobile restrictions for this device.'
};
str = function() {
var args,
i, j, o,
sstr;
args = slice.call(arguments);
o = args.shift();
sstr = (strings && strings[o] ? strings[o] : '');
if (sstr && args && args.length) {
for (i = 0, j = args.length; i < j; i++) {
sstr = sstr.replace('%s', args[i]);
}
}
return sstr;
};
loopFix = function(sOpt) {
if (fV === 8 && sOpt.loops > 1 && sOpt.stream) {
_wDS('as2loop');
sOpt.stream = false;
}
return sOpt;
};
policyFix = function(sOpt, sPre) {
if (sOpt && !sOpt.usePolicyFile && (sOpt.onid3 || sOpt.usePeakData || sOpt.useWaveformData || sOpt.useEQData)) {
sm2._wD((sPre || '') + str('policy'));
sOpt.usePolicyFile = true;
}
return sOpt;
};
complain = function(sMsg) {
if (hasConsole && console.warn !== _undefined) {
console.warn(sMsg);
} else {
sm2._wD(sMsg);
}
};
doNothing = function() {
return false;
};
disableObject = function(o) {
var oProp;
for (oProp in o) {
if (o.hasOwnProperty(oProp) && typeof o[oProp] === 'function') {
o[oProp] = doNothing;
}
}
oProp = null;
};
failSafely = function(bNoDisable) {
if (bNoDisable === _undefined) {
bNoDisable = false;
}
if (disabled || bNoDisable) {
sm2.disable(bNoDisable);
}
};
normalizeMovieURL = function(movieURL) {
var urlParams = null, url;
if (movieURL) {
if (movieURL.match(/\.swf(\?.*)?$/i)) {
urlParams = movieURL.substr(movieURL.toLowerCase().lastIndexOf('.swf?') + 4);
if (urlParams) return movieURL;
} else if (movieURL.lastIndexOf('/') !== movieURL.length - 1) {
movieURL += '/';
}
}
url = (movieURL && movieURL.lastIndexOf('/') !== -1 ? movieURL.substr(0, movieURL.lastIndexOf('/') + 1) : './') + sm2.movieURL;
if (sm2.noSWFCache) {
url += ('?ts=' + new Date().getTime());
}
return url;
};
setVersionInfo = function() {
fV = parseInt(sm2.flashVersion, 10);
if (fV !== 8 && fV !== 9) {
sm2._wD(str('badFV', fV, defaultFlashVersion));
sm2.flashVersion = fV = defaultFlashVersion;
}
var isDebug = (sm2.debugMode || sm2.debugFlash ? '_debug.swf' : '.swf');
if (sm2.useHTML5Audio && !sm2.html5Only && sm2.audioFormats.mp4.required && fV < 9) {
sm2._wD(str('needfl9'));
sm2.flashVersion = fV = 9;
}
sm2.version = sm2.versionNumber + (sm2.html5Only ? ' (HTML5-only mode)' : (fV === 9 ? ' (AS3/Flash 9)' : ' (AS2/Flash 8)'));
if (fV > 8) {
sm2.defaultOptions = mixin(sm2.defaultOptions, sm2.flash9Options);
sm2.features.buffering = true;
sm2.defaultOptions = mixin(sm2.defaultOptions, sm2.movieStarOptions);
sm2.filePatterns.flash9 = new RegExp('\\.(mp3|' + netStreamTypes.join('|') + ')(\\?.*)?$', 'i');
sm2.features.movieStar = true;
} else {
sm2.features.movieStar = false;
}
sm2.filePattern = sm2.filePatterns[(fV !== 8 ? 'flash9' : 'flash8')];
sm2.movieURL = (fV === 8 ? 'soundmanager2.swf' : 'soundmanager2_flash9.swf').replace('.swf', isDebug);
sm2.features.peakData = sm2.features.waveformData = sm2.features.eqData = (fV > 8);
};
setPolling = function(bPolling, bHighPerformance) {
if (!flash) {
return;
}
flash._setPolling(bPolling, bHighPerformance);
};
initDebug = function() {
if (sm2.debugURLParam.test(wl)) {
sm2.setupOptions.debugMode = sm2.debugMode = true;
}
if (id(sm2.debugID)) {
return;
}
var oD, oDebug, oTarget, oToggle, tmp;
if (sm2.debugMode && !id(sm2.debugID) && (!hasConsole || !sm2.useConsole || !sm2.consoleOnly)) {
oD = doc.createElement('div');
oD.id = sm2.debugID + '-toggle';
oToggle = {
position: 'fixed',
bottom: '0px',
right: '0px',
width: '1.2em',
height: '1.2em',
lineHeight: '1.2em',
margin: '2px',
textAlign: 'center',
border: '1px solid #999',
cursor: 'pointer',
background: '#fff',
color: '#333',
zIndex: 10001
};
oD.appendChild(doc.createTextNode('-'));
oD.onclick = toggleDebug;
oD.title = 'Toggle SM2 debug console';
if (ua.match(/msie 6/i)) {
oD.style.position = 'absolute';
oD.style.cursor = 'hand';
}
for (tmp in oToggle) {
if (oToggle.hasOwnProperty(tmp)) {
oD.style[tmp] = oToggle[tmp];
}
}
oDebug = doc.createElement('div');
oDebug.id = sm2.debugID;
oDebug.style.display = (sm2.debugMode ? 'block' : 'none');
if (sm2.debugMode && !id(oD.id)) {
try {
oTarget = getDocument();
oTarget.appendChild(oD);
} catch(e2) {
throw new Error(str('domError') + ' \n' + e2.toString());
}
oTarget.appendChild(oDebug);
}
}
oTarget = null;
};
idCheck = this.getSoundById;
_wDS = function(o, errorLevel) {
return (!o ? '' : sm2._wD(str(o), errorLevel));
};
toggleDebug = function() {
var o = id(sm2.debugID),
oT = id(sm2.debugID + '-toggle');
if (!o) {
return;
}
if (debugOpen) {
oT.innerHTML = '+';
o.style.display = 'none';
} else {
oT.innerHTML = '-';
o.style.display = 'block';
}
debugOpen = !debugOpen;
};
debugTS = function(sEventType, bSuccess, sMessage) {
if (window.sm2Debugger !== _undefined) {
try {
sm2Debugger.handleEvent(sEventType, bSuccess, sMessage);
} catch(e) {
return false;
}
}
return true;
};
getSWFCSS = function() {
var css = [];
if (sm2.debugMode) {
css.push(swfCSS.sm2Debug);
}
if (sm2.debugFlash) {
css.push(swfCSS.flashDebug);
}
if (sm2.useHighPerformance) {
css.push(swfCSS.highPerf);
}
return css.join(' ');
};
flashBlockHandler = function() {
var name = str('fbHandler'),
p = sm2.getMoviePercent(),
css = swfCSS,
error = {
type: 'FLASHBLOCK'
};
if (sm2.html5Only) {
return;
}
if (!sm2.ok()) {
if (needsFlash) {
sm2.oMC.className = getSWFCSS() + ' ' + css.swfDefault + ' ' + (p === null ? css.swfTimedout : css.swfError);
sm2._wD(name + ': ' + str('fbTimeout') + (p ? ' (' + str('fbLoaded') + ')' : ''));
}
sm2.didFlashBlock = true;
processOnEvents({
type: 'ontimeout',
ignoreInit: true,
error: error
});
catchError(error);
} else {
if (sm2.didFlashBlock) {
sm2._wD(name + ': Unblocked');
}
if (sm2.oMC) {
sm2.oMC.className = [getSWFCSS(), css.swfDefault, css.swfLoaded + (sm2.didFlashBlock ? ' ' + css.swfUnblocked : '')].join(' ');
}
}
};
addOnEvent = function(sType, oMethod, oScope) {
if (on_queue[sType] === _undefined) {
on_queue[sType] = [];
}
on_queue[sType].push({
method: oMethod,
scope: (oScope || null),
fired: false
});
};
processOnEvents = function(oOptions) {
if (!oOptions) {
oOptions = {
type: (sm2.ok() ? 'onready' : 'ontimeout')
};
}
if (!didInit && oOptions && !oOptions.ignoreInit) return false;
if (oOptions.type === 'ontimeout' && (sm2.ok() || (disabled && !oOptions.ignoreInit))) return false;
var status = {
success: (oOptions && oOptions.ignoreInit ? sm2.ok() : !disabled)
},
srcQueue = (oOptions && oOptions.type ? on_queue[oOptions.type] || [] : []),
queue = [], i, j,
args = [status],
canRetry = (needsFlash && !sm2.ok());
if (oOptions.error) {
args[0].error = oOptions.error;
}
for (i = 0, j = srcQueue.length; i < j; i++) {
if (srcQueue[i].fired !== true) {
queue.push(srcQueue[i]);
}
}
if (queue.length) {
for (i = 0, j = queue.length; i < j; i++) {
if (queue[i].scope) {
queue[i].method.apply(queue[i].scope, args);
} else {
queue[i].method.apply(this, args);
}
if (!canRetry) {
queue[i].fired = true;
}
}
}
return true;
};
initUserOnload = function() {
window.setTimeout(function() {
if (sm2.useFlashBlock) {
flashBlockHandler();
}
processOnEvents();
if (typeof sm2.onload === 'function') {
_wDS('onload', 1);
sm2.onload.apply(window);
_wDS('onloadOK', 1);
}
if (sm2.waitForWindowLoad) {
event.add(window, 'load', initUserOnload);
}
}, 1);
};
detectFlash = function() {
/**
* Hat tip: Flash Detect library (BSD, (C) 2007) by Carl "DocYes" S. Yestrau
* http://featureblend.com/javascript-flash-detection-library.html / http://featureblend.com/license.txt
*/
if (hasFlash !== _undefined) return hasFlash;
var hasPlugin = false, n = navigator, obj, type, types, AX = window.ActiveXObject;
var nP;
try {
nP = n.plugins;
} catch(e) {
nP = undefined;
}
if (nP && nP.length) {
type = 'application/x-shockwave-flash';
types = n.mimeTypes;
if (types && types[type] && types[type].enabledPlugin && types[type].enabledPlugin.description) {
hasPlugin = true;
}
} else if (AX !== _undefined && !ua.match(/MSAppHost/i)) {
try {
obj = new AX('ShockwaveFlash.ShockwaveFlash');
} catch(e) {
obj = null;
}
hasPlugin = (!!obj);
obj = null;
}
hasFlash = hasPlugin;
return hasPlugin;
};
featureCheck = function() {
var flashNeeded,
item,
formats = sm2.audioFormats,
isSpecial = (is_iDevice && !!(ua.match(/os (1|2|3_0|3_1)\s/i)));
if (isSpecial) {
sm2.hasHTML5 = false;
sm2.html5Only = true;
if (sm2.oMC) {
sm2.oMC.style.display = 'none';
}
} else if (sm2.useHTML5Audio) {
if (!sm2.html5 || !sm2.html5.canPlayType) {
sm2._wD('SoundManager: No HTML5 Audio() support detected.');
sm2.hasHTML5 = false;
}
if (isBadSafari) {
sm2._wD(smc + 'Note: Buggy HTML5 Audio in Safari on this OS X release, see https://bugs.webkit.org/show_bug.cgi?id=32159 - ' + (!hasFlash ? ' would use flash fallback for MP3/MP4, but none detected.' : 'will use flash fallback for MP3/MP4, if available'), 1);
}
}
if (sm2.useHTML5Audio && sm2.hasHTML5) {
canIgnoreFlash = true;
for (item in formats) {
if (formats.hasOwnProperty(item)) {
if (formats[item].required) {
if (!sm2.html5.canPlayType(formats[item].type)) {
canIgnoreFlash = false;
flashNeeded = true;
} else if (sm2.preferFlash && (sm2.flash[item] || sm2.flash[formats[item].type])) {
flashNeeded = true;
}
}
}
}
}
if (sm2.ignoreFlash) {
flashNeeded = false;
canIgnoreFlash = true;
}
sm2.html5Only = (sm2.hasHTML5 && sm2.useHTML5Audio && !flashNeeded);
return (!sm2.html5Only);
};
parseURL = function(url) {
/**
* Internal: Finds and returns the first playable URL (or failing that, the first URL.)
* @param {string or array} url A single URL string, OR, an array of URL strings or {url:'/path/to/resource', type:'audio/mp3'} objects.
*/
var i, j, urlResult = 0, result;
if (url instanceof Array) {
for (i = 0, j = url.length; i < j; i++) {
if (url[i] instanceof Object) {
if (sm2.canPlayMIME(url[i].type)) {
urlResult = i;
break;
}
} else if (sm2.canPlayURL(url[i])) {
urlResult = i;
break;
}
}
if (url[urlResult].url) {
url[urlResult] = url[urlResult].url;
}
result = url[urlResult];
} else {
result = url;
}
return result;
};
startTimer = function(oSound) {
/**
* attach a timer to this sound, and start an interval if needed
*/
if (!oSound._hasTimer) {
oSound._hasTimer = true;
if (!mobileHTML5 && sm2.html5PollingInterval) {
if (h5IntervalTimer === null && h5TimerCount === 0) {
h5IntervalTimer = setInterval(timerExecute, sm2.html5PollingInterval);
}
h5TimerCount++;
}
}
};
stopTimer = function(oSound) {
/**
* detach a timer
*/
if (oSound._hasTimer) {
oSound._hasTimer = false;
if (!mobileHTML5 && sm2.html5PollingInterval) {
h5TimerCount--;
}
}
};
timerExecute = function() {
/**
* manual polling for HTML5 progress events, ie., whileplaying()
* (can achieve greater precision than conservative default HTML5 interval)
*/
var i;
if (h5IntervalTimer !== null && !h5TimerCount) {
clearInterval(h5IntervalTimer);
h5IntervalTimer = null;
return;
}
for (i = sm2.soundIDs.length - 1; i >= 0; i--) {
if (sm2.sounds[sm2.soundIDs[i]].isHTML5 && sm2.sounds[sm2.soundIDs[i]]._hasTimer) {
sm2.sounds[sm2.soundIDs[i]]._onTimer();
}
}
};
catchError = function(options) {
options = (options !== _undefined ? options : {});
if (typeof sm2.onerror === 'function') {
sm2.onerror.apply(window, [{
type: (options.type !== _undefined ? options.type : null)
}]);
}
if (options.fatal !== _undefined && options.fatal) {
sm2.disable();
}
};
badSafariFix = function() {
if (!isBadSafari || !detectFlash()) {
return;
}
var aF = sm2.audioFormats, i, item;
for (item in aF) {
if (aF.hasOwnProperty(item)) {
if (item === 'mp3' || item === 'mp4') {
sm2._wD(sm + ': Using flash fallback for ' + item + ' format');
sm2.html5[item] = false;
if (aF[item] && aF[item].related) {
for (i = aF[item].related.length - 1; i >= 0; i--) {
sm2.html5[aF[item].related[i]] = false;
}
}
}
}
}
};
/**
* Pseudo-private flash/ExternalInterface methods
* ----------------------------------------------
*/
this._setSandboxType = function(sandboxType) {
var sb = sm2.sandbox;
sb.type = sandboxType;
sb.description = sb.types[(sb.types[sandboxType] !== _undefined ? sandboxType : 'unknown')];
if (sb.type === 'localWithFile') {
sb.noRemote = true;
sb.noLocal = false;
_wDS('secNote', 2);
} else if (sb.type === 'localWithNetwork') {
sb.noRemote = false;
sb.noLocal = true;
} else if (sb.type === 'localTrusted') {
sb.noRemote = false;
sb.noLocal = false;
}
};
this._externalInterfaceOK = function(swfVersion) {
if (sm2.swfLoaded) {
return;
}
var e;
debugTS('swf', true);
debugTS('flashtojs', true);
sm2.swfLoaded = true;
tryInitOnFocus = false;
if (isBadSafari) {
badSafariFix();
}
if (!swfVersion || swfVersion.replace(/\+dev/i, '') !== sm2.versionNumber.replace(/\+dev/i, '')) {
e = sm + ': Fatal: JavaScript file build "' + sm2.versionNumber + '" does not match Flash SWF build "' + swfVersion + '" at ' + sm2.url + '. Ensure both are up-to-date.';
setTimeout(function() {
throw new Error(e);
}, 0);
return;
}
setTimeout(init, isIE ? 100 : 1);
};
/**
* Private initialization helpers
* ------------------------------
*/
createMovie = function(movieID, movieURL) {
if (didAppend && appendSuccess) return false;
function initMsg() {
var options = [],
title,
msg = [],
delimiter = ' + ';
title = 'SoundManager ' + sm2.version + (!sm2.html5Only && sm2.useHTML5Audio ? (sm2.hasHTML5 ? ' + HTML5 audio' : ', no HTML5 audio support') : '');
if (!sm2.html5Only) {
if (sm2.preferFlash) {
options.push('preferFlash');
}
if (sm2.useHighPerformance) {
options.push('useHighPerformance');
}
if (sm2.flashPollingInterval) {
options.push('flashPollingInterval (' + sm2.flashPollingInterval + 'ms)');
}
if (sm2.html5PollingInterval) {
options.push('html5PollingInterval (' + sm2.html5PollingInterval + 'ms)');
}
if (sm2.wmode) {
options.push('wmode (' + sm2.wmode + ')');
}
if (sm2.debugFlash) {
options.push('debugFlash');
}
if (sm2.useFlashBlock) {
options.push('flashBlock');
}
} else if (sm2.html5PollingInterval) {
options.push('html5PollingInterval (' + sm2.html5PollingInterval + 'ms)');
}
if (options.length) {
msg = msg.concat([options.join(delimiter)]);
}
sm2._wD(title + (msg.length ? delimiter + msg.join(', ') : ''), 1);
showSupport();
}
if (sm2.html5Only) {
setVersionInfo();
initMsg();
sm2.oMC = id(sm2.movieID);
init();
didAppend = true;
appendSuccess = true;
return false;
}
var remoteURL = (movieURL || sm2.url),
localURL = (sm2.altURL || remoteURL),
swfTitle = 'JS/Flash audio component (SoundManager 2)',
oTarget = getDocument(),
extraClass = getSWFCSS(),
isRTL = null,
html = doc.getElementsByTagName('html')[0],
oEmbed, oMovie, tmp, movieHTML, oEl, s, x, sClass;
isRTL = (html && html.dir && html.dir.match(/rtl/i));
movieID = (movieID === _undefined ? sm2.id : movieID);
function param(name, value) {
return '<param name="' + name + '" value="' + value + '" />';
}
setVersionInfo();
sm2.url = normalizeMovieURL(overHTTP ? remoteURL : localURL);
movieURL = sm2.url;
sm2.wmode = (!sm2.wmode && sm2.useHighPerformance ? 'transparent' : sm2.wmode);
if (sm2.wmode !== null && (ua.match(/msie 8/i) || (!isIE && !sm2.useHighPerformance)) && navigator.platform.match(/win32|win64/i)) {
/**
* extra-special case: movie doesn't load until scrolled into view when using wmode = anything but 'window' here
* does not apply when using high performance (position:fixed means on-screen), OR infinite flash load timeout
* wmode breaks IE 8 on Vista + Win7 too in some cases, as of January 2011 (?)
*/
messages.push(strings.spcWmode);
sm2.wmode = null;
}
oEmbed = {
name: movieID,
id: movieID,
src: movieURL,
quality: 'high',
allowScriptAccess: sm2.allowScriptAccess,
bgcolor: sm2.bgColor,
pluginspage: http + 'www.macromedia.com/go/getflashplayer',
title: swfTitle,
type: 'application/x-shockwave-flash',
wmode: sm2.wmode,
hasPriority: 'true'
};
if (sm2.debugFlash) {
oEmbed.FlashVars = 'debug=1';
}
if (!sm2.wmode) {
delete oEmbed.wmode;
}
if (isIE) {
oMovie = doc.createElement('div');
movieHTML = [
'<object id="' + movieID + '" data="' + movieURL + '" type="' + oEmbed.type + '" title="' + oEmbed.title + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0">',
param('movie', movieURL),
param('AllowScriptAccess', sm2.allowScriptAccess),
param('quality', oEmbed.quality),
(sm2.wmode ? param('wmode', sm2.wmode) : ''),
param('bgcolor', sm2.bgColor),
param('hasPriority', 'true'),
(sm2.debugFlash ? param('FlashVars', oEmbed.FlashVars) : ''),
'</object>'
].join('');
} else {
oMovie = doc.createElement('embed');
for (tmp in oEmbed) {
if (oEmbed.hasOwnProperty(tmp)) {
oMovie.setAttribute(tmp, oEmbed[tmp]);
}
}
}
initDebug();
extraClass = getSWFCSS();
oTarget = getDocument();
if (oTarget) {
sm2.oMC = (id(sm2.movieID) || doc.createElement('div'));
if (!sm2.oMC.id) {
sm2.oMC.id = sm2.movieID;
sm2.oMC.className = swfCSS.swfDefault + ' ' + extraClass;
s = null;
oEl = null;
if (!sm2.useFlashBlock) {
if (sm2.useHighPerformance) {
s = {
position: 'fixed',
width: '8px',
height: '8px',
bottom: '0px',
left: '0px',
overflow: 'hidden'
};
} else {
s = {
position: 'absolute',
width: '6px',
height: '6px',
top: '-9999px',
left: '-9999px'
};
if (isRTL) {
s.left = Math.abs(parseInt(s.left, 10)) + 'px';
}
}
}
if (isWebkit) {
sm2.oMC.style.zIndex = 10000;
}
if (!sm2.debugFlash) {
for (x in s) {
if (s.hasOwnProperty(x)) {
sm2.oMC.style[x] = s[x];
}
}
}
try {
if (!isIE) {
sm2.oMC.appendChild(oMovie);
}
oTarget.appendChild(sm2.oMC);
if (isIE) {
oEl = sm2.oMC.appendChild(doc.createElement('div'));
oEl.className = swfCSS.swfBox;
oEl.innerHTML = movieHTML;
}
appendSuccess = true;
} catch(e) {
throw new Error(str('domError') + ' \n' + e.toString());
}
} else {
sClass = sm2.oMC.className;
sm2.oMC.className = (sClass ? sClass + ' ' : swfCSS.swfDefault) + (extraClass ? ' ' + extraClass : '');
sm2.oMC.appendChild(oMovie);
if (isIE) {
oEl = sm2.oMC.appendChild(doc.createElement('div'));
oEl.className = swfCSS.swfBox;
oEl.innerHTML = movieHTML;
}
appendSuccess = true;
}
}
didAppend = true;
initMsg();
return true;
};
initMovie = function() {
if (sm2.html5Only) {
createMovie();
return false;
}
if (flash) return false;
if (!sm2.url) {
/**
* Something isn't right - we've reached init, but the soundManager url property has not been set.
* User has not called setup({url: ...}), or has not set soundManager.url (legacy use case) directly before init time.
* Notify and exit. If user calls setup() with a url: property, init will be restarted as in the deferred loading case.
*/
_wDS('noURL');
return false;
}
flash = sm2.getMovie(sm2.id);
if (!flash) {
if (!oRemoved) {
createMovie(sm2.id, sm2.url);
} else {
if (!isIE) {
sm2.oMC.appendChild(oRemoved);
} else {
sm2.oMC.innerHTML = oRemovedHTML;
}
oRemoved = null;
didAppend = true;
}
flash = sm2.getMovie(sm2.id);
}
if (typeof sm2.oninitmovie === 'function') {
setTimeout(sm2.oninitmovie, 1);
}
flushMessages();
return true;
};
delayWaitForEI = function() {
setTimeout(waitForEI, 1000);
};
rebootIntoHTML5 = function() {
window.setTimeout(function() {
complain(smc + 'useFlashBlock is false, 100% HTML5 mode is possible. Rebooting with preferFlash: false...');
sm2.setup({
preferFlash: false
}).reboot();
sm2.didFlashBlock = true;
sm2.beginDelayedInit();
}, 1);
};
waitForEI = function() {
var p,
loadIncomplete = false;
if (!sm2.url) {
return;
}
if (waitingForEI) {
return;
}
waitingForEI = true;
event.remove(window, 'load', delayWaitForEI);
if (hasFlash && tryInitOnFocus && !isFocused) {
_wDS('waitFocus');
return;
}
if (!didInit) {
p = sm2.getMoviePercent();
if (p > 0 && p < 100) {
loadIncomplete = true;
}
}
setTimeout(function() {
p = sm2.getMoviePercent();
if (loadIncomplete) {
waitingForEI = false;
sm2._wD(str('waitSWF'));
window.setTimeout(delayWaitForEI, 1);
return;
}
if (!didInit) {
sm2._wD(sm + ': No Flash response within expected time. Likely causes: ' + (p === 0 ? 'SWF load failed, ' : '') + 'Flash blocked or JS-Flash security error.' + (sm2.debugFlash ? ' ' + str('checkSWF') : ''), 2);
if (!overHTTP && p) {
_wDS('localFail', 2);
if (!sm2.debugFlash) {
_wDS('tryDebug', 2);
}
}
if (p === 0) {
sm2._wD(str('swf404', sm2.url), 1);
}
debugTS('flashtojs', false, ': Timed out' + (overHTTP ? ' (Check flash security or flash blockers)' : ' (No plugin/missing SWF?)'));
}
if (!didInit && okToDisable) {
if (p === null) {
if (sm2.useFlashBlock || sm2.flashLoadTimeout === 0) {
if (sm2.useFlashBlock) {
flashBlockHandler();
}
_wDS('waitForever');
} else if (!sm2.useFlashBlock && canIgnoreFlash) {
rebootIntoHTML5();
} else {
_wDS('waitForever');
processOnEvents({
type: 'ontimeout',
ignoreInit: true,
error: {
type: 'INIT_FLASHBLOCK'
}
});
}
} else if (sm2.flashLoadTimeout === 0) {
_wDS('waitForever');
} else if (!sm2.useFlashBlock && canIgnoreFlash) {
rebootIntoHTML5();
} else {
failSafely(true);
}
}
}, sm2.flashLoadTimeout);
};
handleFocus = function() {
function cleanup() {
event.remove(window, 'focus', handleFocus);
}
if (isFocused || !tryInitOnFocus) {
cleanup();
return true;
}
okToDisable = true;
isFocused = true;
_wDS('gotFocus');
waitingForEI = false;
delayWaitForEI();
cleanup();
return true;
};
flushMessages = function() {
if (messages.length) {
sm2._wD('SoundManager 2: ' + messages.join(' '), 1);
messages = [];
}
};
showSupport = function() {
flushMessages();
var item, tests = [];
if (sm2.useHTML5Audio && sm2.hasHTML5) {
for (item in sm2.audioFormats) {
if (sm2.audioFormats.hasOwnProperty(item)) {
tests.push(item + ' = ' + sm2.html5[item] + (!sm2.html5[item] && needsFlash && sm2.flash[item] ? ' (using flash)' : (sm2.preferFlash && sm2.flash[item] && needsFlash ? ' (preferring flash)' : (!sm2.html5[item] ? ' (' + (sm2.audioFormats[item].required ? 'required, ' : '') + 'and no flash support)' : ''))));
}
}
sm2._wD('SoundManager 2 HTML5 support: ' + tests.join(', '), 1);
}
};
initComplete = function(bNoDisable) {
if (didInit) return false;
if (sm2.html5Only) {
_wDS('sm2Loaded', 1);
didInit = true;
initUserOnload();
debugTS('onload', true);
return true;
}
var wasTimeout = (sm2.useFlashBlock && sm2.flashLoadTimeout && !sm2.getMoviePercent()),
result = true,
error;
if (!wasTimeout) {
didInit = true;
}
error = {
type: (!hasFlash && needsFlash ? 'NO_FLASH' : 'INIT_TIMEOUT')
};
sm2._wD('SoundManager 2 ' + (disabled ? 'failed to load' : 'loaded') + ' (' + (disabled ? 'Flash security/load error' : 'OK') + ') ' + String.fromCharCode(disabled ? 10006 : 10003), disabled ? 2 : 1);
if (disabled || bNoDisable) {
if (sm2.useFlashBlock && sm2.oMC) {
sm2.oMC.className = getSWFCSS() + ' ' + (sm2.getMoviePercent() === null ? swfCSS.swfTimedout : swfCSS.swfError);
}
processOnEvents({
type: 'ontimeout',
error: error,
ignoreInit: true
});
debugTS('onload', false);
catchError(error);
result = false;
} else {
debugTS('onload', true);
}
if (!disabled) {
if (sm2.waitForWindowLoad && !windowLoaded) {
_wDS('waitOnload');
event.add(window, 'load', initUserOnload);
} else {
if (sm2.waitForWindowLoad && windowLoaded) {
_wDS('docLoaded');
}
initUserOnload();
}
}
return result;
};
/**
* apply top-level setupOptions object as local properties, eg., this.setupOptions.flashVersion -> this.flashVersion (soundManager.flashVersion)
* this maintains backward compatibility, and allows properties to be defined separately for use by soundManager.setup().
*/
setProperties = function() {
var i,
o = sm2.setupOptions;
for (i in o) {
if (o.hasOwnProperty(i)) {
if (sm2[i] === _undefined) {
sm2[i] = o[i];
} else if (sm2[i] !== o[i]) {
sm2.setupOptions[i] = sm2[i];
}
}
}
};
init = function() {
if (didInit) {
_wDS('didInit');
return false;
}
function cleanup() {
event.remove(window, 'load', sm2.beginDelayedInit);
}
if (sm2.html5Only) {
if (!didInit) {
cleanup();
sm2.enabled = true;
initComplete();
}
return true;
}
initMovie();
try {
flash._externalInterfaceTest(false);
/**
* Apply user-specified polling interval, OR, if "high performance" set, faster vs. default polling
* (determines frequency of whileloading/whileplaying callbacks, effectively driving UI framerates)
*/
setPolling(true, (sm2.flashPollingInterval || (sm2.useHighPerformance ? 10 : 50)));
if (!sm2.debugMode) {
flash._disableDebug();
}
sm2.enabled = true;
debugTS('jstoflash', true);
if (!sm2.html5Only) {
event.add(window, 'unload', doNothing);
}
} catch(e) {
sm2._wD('js/flash exception: ' + e.toString());
debugTS('jstoflash', false);
catchError({
type: 'JS_TO_FLASH_EXCEPTION',
fatal: true
});
failSafely(true);
initComplete();
return false;
}
initComplete();
cleanup();
return true;
};
domContentLoaded = function() {
if (didDCLoaded) return false;
didDCLoaded = true;
setProperties();
initDebug();
if (!hasFlash && sm2.hasHTML5) {
sm2._wD('SoundManager 2: No Flash detected' + (!sm2.useHTML5Audio ? ', enabling HTML5.' : '. Trying HTML5-only mode.'), 1);
sm2.setup({
useHTML5Audio: true,
preferFlash: false
});
}
testHTML5();
if (!hasFlash && needsFlash) {
messages.push(strings.needFlash);
sm2.setup({
flashLoadTimeout: 1
});
}
if (doc.removeEventListener) {
doc.removeEventListener('DOMContentLoaded', domContentLoaded, false);
}
initMovie();
return true;
};
domContentLoadedIE = function() {
if (doc.readyState === 'complete') {
domContentLoaded();
doc.detachEvent('onreadystatechange', domContentLoadedIE);
}
return true;
};
winOnLoad = function() {
windowLoaded = true;
domContentLoaded();
event.remove(window, 'load', winOnLoad);
};
detectFlash();
event.add(window, 'focus', handleFocus);
event.add(window, 'load', delayWaitForEI);
event.add(window, 'load', winOnLoad);
if (doc.addEventListener) {
doc.addEventListener('DOMContentLoaded', domContentLoaded, false);
} else if (doc.attachEvent) {
doc.attachEvent('onreadystatechange', domContentLoadedIE);
} else {
debugTS('onload', false);
catchError({
type: 'NO_DOM2_EVENTS',
fatal: true
});
}
} // SoundManager()
if (window.SM2_DEFER === _undefined || !SM2_DEFER) {
soundManager = new SoundManager();
}
/**
* SoundManager public interfaces
* ------------------------------
*/
if (typeof module === 'object' && module && typeof module.exports === 'object') {
/**
* commonJS module
*/
module.exports.SoundManager = SoundManager;
module.exports.soundManager = soundManager;
} else if (typeof define === 'function' && define.amd) {
/**
* AMD - requireJS
* basic usage:
* require(["/path/to/soundmanager2.js"], function(SoundManager) {
*   SoundManager.getInstance().setup({
*     url: '/swf/',
*     onready: function() { ... }
*   })
* });
*
* SM2_DEFER usage:
* window.SM2_DEFER = true;
* require(["/path/to/soundmanager2.js"], function(SoundManager) {
*   SoundManager.getInstance(function() {
*     var soundManager = new SoundManager.constructor();
*     soundManager.setup({
*       url: '/swf/',
*       ...
*     });
*     ...
*     soundManager.beginDelayedInit();
*     return soundManager;
*   })
* });
*/
define(function() {
/**
* Retrieve the global instance of SoundManager.
* If a global instance does not exist it can be created using a callback.
*
* @param {Function} smBuilder Optional: Callback used to create a new SoundManager instance
* @return {SoundManager} The global SoundManager instance
*/
function getInstance(smBuilder) {
if (!window.soundManager && smBuilder instanceof Function) {
var instance = smBuilder(SoundManager);
if (instance instanceof SoundManager) {
window.soundManager = instance;
}
}
return window.soundManager;
}
return {
constructor: SoundManager,
getInstance: getInstance
};
});
}
window.SoundManager = SoundManager;
/**
* note: SM2 requires a window global due to Flash, which makes calls to window.soundManager.
* Flash may not always be needed, but this is not known until async init and SM2 may even "reboot" into Flash mode.
*/
window.soundManager = soundManager;
}(window));
(function(window) {
/**
* SoundManager 2: "Bar UI" player
* Copyright (c) 2014, Scott Schiller. All rights reserved.
* http://www.schillmania.com/projects/soundmanager2/
* Code provided under BSD license.
* http://schillmania.com/projects/soundmanager2/license.txt
*/
/* global console, document, navigator, soundManager, window */
'use strict';
var Player,
players = [],
playerSelector = '.sm2-bar-ui',
playerOptions,
utils;
/**
* The following are player object event callback examples.
* Override globally by setting window.sm2BarPlayers.on = {}, or individually by window.sm2BarPlayers[0].on = {} etc.
* soundObject is provided for whileplaying() etc., but playback control should be done via the player object.
*/
players.on = {
/*
play: function(player, soundObject) {
console.log('playing', player);
},
whileplaying: function(player, soundObject) {
console.log('whileplaying', player, soundObject);
},
finish: function(player, soundObject) {
console.log('finish', player);
},
pause: function(player, soundObject) {
console.log('pause', player);
},
error: function(player, soundObject) {
console.log('error', player);
},
end: function(player, soundObject) {
console.log('end', player);
}
*/
};
playerOptions = {
stopOtherSounds: true,
excludeClass: 'sm2-exclude'
};
soundManager.setup({
html5PollingInterval: 50,
flashVersion: 9
});
soundManager.onready(function() {
var nodes, i, j;
nodes = utils.dom.getAll(playerSelector);
if (nodes && nodes.length) {
for (i = 0, j = nodes.length; i < j; i++) {
players.push(new Player(nodes[i]));
}
}
});
/**
* player bits
*/
Player = function(playerNode) {
var css, dom, extras, playlistController, soundObject, actions, actionData, defaultItem, defaultVolume, firstOpen, exports;
css = {
disabled: 'disabled',
selected: 'selected',
active: 'active',
legacy: 'legacy',
noVolume: 'no-volume',
playlistOpen: 'playlist-open'
};
dom = {
o: null,
playlist: null,
playlistTarget: null,
playlistContainer: null,
time: null,
player: null,
progress: null,
progressTrack: null,
progressBar: null,
duration: null,
volume: null
};
extras = {
loadFailedCharacter: '<span title="Failed to load/play." class="load-error">âœ–</span>'
};
function stopOtherSounds() {
if (playerOptions.stopOtherSounds) {
soundManager.stopAll();
}
}
function callback(method, oSound) {
if (method) {
if (exports.on && exports.on[method]) {
exports.on[method](exports, oSound);
} else if (players.on[method]) {
players.on[method](exports, oSound);
}
}
}
function getTime(msec, useString) {
var nSec = Math.floor(msec / 1000),
hh = Math.floor(nSec / 3600),
min = Math.floor(nSec / 60) - Math.floor(hh * 60),
sec = Math.floor(nSec - (hh * 3600) - (min * 60));
return (useString ? ((hh ? hh + ':' : '') + (hh && min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec)) : { min: min, sec: sec });
}
function setTitle(item) {
var links = item.getElementsByTagName('a');
if (links.length) {
item = links[0];
}
dom.playlistTarget.innerHTML = '<ul class="sm2-playlist-bd"><li>' + item.innerHTML.replace(extras.loadFailedCharacter, '') + '</li></ul>';
if (dom.playlistTarget.getElementsByTagName('li')[0].scrollWidth > dom.playlistTarget.offsetWidth) {
dom.playlistTarget.innerHTML = '<ul class="sm2-playlist-bd"><li><marquee>' + item.innerHTML + '</marquee></li></ul>';
}
}
function makeSound(url) {
var sound = soundManager.createSound({
url: url,
volume: defaultVolume,
whileplaying: function() {
var progressMaxLeft = 100,
left,
width;
left = Math.min(progressMaxLeft, Math.max(0, (progressMaxLeft * (this.position / this.durationEstimate)))) + '%';
width = Math.min(100, Math.max(0, (100 * (this.position / this.durationEstimate)))) + '%';
if (this.duration) {
dom.progress.style.left = left;
dom.progressBar.style.width = width;
dom.time.innerHTML = getTime(this.position, true);
}
callback('whileplaying', this);
},
onbufferchange: function(isBuffering) {
if (isBuffering) {
utils.css.add(dom.o, 'buffering');
} else {
utils.css.remove(dom.o, 'buffering');
}
},
onplay: function() {
utils.css.swap(dom.o, 'paused', 'playing');
callback('play', this);
},
onpause: function() {
utils.css.swap(dom.o, 'playing', 'paused');
callback('pause', this);
},
onresume: function() {
utils.css.swap(dom.o, 'paused', 'playing');
},
whileloading: function() {
if (!this.isHTML5) {
dom.duration.innerHTML = getTime(this.durationEstimate, true);
}
},
onload: function(ok) {
if (ok) {
dom.duration.innerHTML = getTime(this.duration, true);
} else if (this._iO && this._iO.onerror) {
this._iO.onerror();
}
},
onerror: function() {
var item, element, html;
item = playlistController.getItem();
if (item) {
if (extras.loadFailedCharacter) {
dom.playlistTarget.innerHTML = dom.playlistTarget.innerHTML.replace('<li>', '<li>' + extras.loadFailedCharacter + ' ');
if (playlistController.data.playlist && playlistController.data.playlist[playlistController.data.selectedIndex]) {
element = playlistController.data.playlist[playlistController.data.selectedIndex].getElementsByTagName('a')[0];
html = element.innerHTML;
if (html.indexOf(extras.loadFailedCharacter) === -1) {
element.innerHTML = extras.loadFailedCharacter + ' ' + html;
}
}
}
}
callback('error', this);
if (navigator.userAgent.match(/mobile/i)) {
actions.next();
} else {
if (playlistController.data.timer) {
window.clearTimeout(playlistController.data.timer);
}
playlistController.data.timer = window.setTimeout(actions.next, 2000);
}
},
onstop: function() {
utils.css.remove(dom.o, 'playing');
},
onfinish: function() {
var lastIndex, item;
utils.css.remove(dom.o, 'playing');
dom.progress.style.left = '0%';
lastIndex = playlistController.data.selectedIndex;
callback('finish', this);
item = playlistController.getNext();
if (item && (playlistController.data.selectedIndex !== lastIndex || (playlistController.data.playlist.length === 1 && playlistController.data.loopMode))) {
playlistController.select(item);
setTitle(item);
stopOtherSounds();
this.play({
url: playlistController.getURL()
});
} else {
callback('end', this);
}
}
});
return sound;
}
function playLink(link) {
if (soundManager.canPlayURL(link.href)) {
if (playlistController.data.timer) {
window.clearTimeout(playlistController.data.timer);
playlistController.data.timer = null;
}
if (!soundObject) {
soundObject = makeSound(link.href);
}
soundObject.stop();
playlistController.select(link.parentNode);
setTitle(link.parentNode);
dom.progress.style.left = '0px';
dom.progressBar.style.width = '0px';
stopOtherSounds();
soundObject.play({
url: link.href,
position: 0
});
}
}
function PlaylistController() {
var data;
data = {
playlist: [],
selectedIndex: 0,
loopMode: false,
timer: null
};
function getPlaylist() {
return data.playlist;
}
function getItem(offset) {
var list,
item;
if (data.selectedIndex === null) {
return offset;
}
list = getPlaylist();
offset = (offset !== undefined ? offset : data.selectedIndex);
offset = Math.max(0, Math.min(offset, list.length));
item = list[offset];
return item;
}
function findOffsetFromItem(item) {
var list,
i,
j,
offset;
offset = -1;
list = getPlaylist();
if (list) {
for (i = 0, j = list.length; i < j; i++) {
if (list[i] === item) {
offset = i;
break;
}
}
}
return offset;
}
function getNext() {
if (data.selectedIndex !== null) {
data.selectedIndex++;
}
if (data.playlist.length > 1) {
if (data.selectedIndex >= data.playlist.length) {
if (data.loopMode) {
data.selectedIndex = 0;
} else {
data.selectedIndex--;
}
}
} else {
data.selectedIndex = null;
}
return getItem();
}
function getPrevious() {
data.selectedIndex--;
if (data.selectedIndex < 0) {
if (data.loopMode) {
data.selectedIndex = data.playlist.length - 1;
} else {
data.selectedIndex++;
}
}
return getItem();
}
function resetLastSelected() {
var items,
i, j;
items = utils.dom.getAll(dom.playlist, '.' + css.selected);
for (i = 0, j = items.length; i < j; i++) {
utils.css.remove(items[i], css.selected);
}
}
function select(item) {
var offset,
itemTop,
itemBottom,
containerHeight,
scrollTop,
itemPadding,
liElement;
resetLastSelected();
if (item) {
liElement = utils.dom.ancestor('li', item);
utils.css.add(liElement, css.selected);
itemTop = item.offsetTop;
itemBottom = itemTop + item.offsetHeight;
containerHeight = dom.playlistContainer.offsetHeight;
scrollTop = dom.playlist.scrollTop;
itemPadding = 8;
if (itemBottom > containerHeight + scrollTop) {
dom.playlist.scrollTop = (itemBottom - containerHeight) + itemPadding;
} else if (itemTop < scrollTop) {
dom.playlist.scrollTop = item.offsetTop - itemPadding;
}
}
offset = findOffsetFromItem(liElement);
data.selectedIndex = offset;
}
function playItemByOffset(offset) {
var item;
offset = (offset || 0);
item = getItem(offset);
if (item) {
playLink(item.getElementsByTagName('a')[0]);
}
}
function getURL() {
var item, url;
item = getItem();
if (item) {
url = item.getElementsByTagName('a')[0].href;
}
return url;
}
function refreshDOM() {
if (!dom.playlist) {
if (window.console && console.warn) {
console.warn('refreshDOM(): playlist node not found?');
}
return;
}
data.playlist = dom.playlist.getElementsByTagName('li');
}
function initDOM() {
dom.playlistTarget = utils.dom.get(dom.o, '.sm2-playlist-target');
dom.playlistContainer = utils.dom.get(dom.o, '.sm2-playlist-drawer');
dom.playlist = utils.dom.get(dom.o, '.sm2-playlist-bd');
}
function initPlaylistController() {
defaultVolume = soundManager.defaultOptions.volume;
initDOM();
refreshDOM();
if (utils.css.has(dom.o, css.playlistOpen)) {
window.setTimeout(function() {
actions.menu(true);
}, 1);
}
}
initPlaylistController();
return {
data: data,
refresh: refreshDOM,
getNext: getNext,
getPrevious: getPrevious,
getItem: getItem,
getURL: getURL,
playItemByOffset: playItemByOffset,
select: select
};
}
function isRightClick(e) {
if (e && ((e.which && e.which === 2) || (e.which === undefined && e.button !== 1))) {
return true;
}
return false;
}
function getActionData(target) {
if (!target) {
return;
}
actionData.volume.x = utils.position.getOffX(target);
actionData.volume.y = utils.position.getOffY(target);
actionData.volume.width = target.offsetWidth;
actionData.volume.height = target.offsetHeight;
actionData.volume.backgroundSize = parseInt(utils.style.get(target, 'background-size'), 10);
if (window.navigator.userAgent.match(/msie|trident/i)) {
actionData.volume.backgroundSize = (actionData.volume.backgroundSize / actionData.volume.width) * 100;
}
}
function handleMouseDown(e) {
var links,
target;
target = e.target || e.srcElement;
if (isRightClick(e)) {
return;
}
if (target.nodeName.toLowerCase() !== 'a') {
links = target.getElementsByTagName('a');
if (links && links.length) {
target = target.getElementsByTagName('a')[0];
}
}
if (utils.css.has(target, 'sm2-volume-control')) {
getActionData(target);
utils.events.add(document, 'mousemove', actions.adjustVolume);
utils.events.add(document, 'touchmove', actions.adjustVolume);
utils.events.add(document, 'mouseup', actions.releaseVolume);
utils.events.add(document, 'touchend', actions.releaseVolume);
actions.adjustVolume(e);
}
}
function handleMouse(e) {
var target, barX, barWidth, x, clientX, newPosition, sound;
target = dom.progressTrack;
barX = utils.position.getOffX(target);
barWidth = target.offsetWidth;
clientX = utils.events.getClientX(e);
x = (clientX - barX);
newPosition = (x / barWidth);
sound = soundObject;
if (sound && sound.duration) {
sound.setPosition(sound.duration * newPosition);
if (sound._iO && sound._iO.whileplaying) {
sound._iO.whileplaying.apply(sound);
}
}
if (e.preventDefault) {
e.preventDefault();
}
return false;
}
function releaseMouse(e) {
utils.events.remove(document, 'mousemove', handleMouse);
utils.events.remove(document, 'touchmove', handleMouse);
utils.css.remove(dom.o, 'grabbing');
utils.events.remove(document, 'mouseup', releaseMouse);
utils.events.remove(document, 'touchend', releaseMouse);
utils.events.preventDefault(e);
return false;
}
function handleProgressMouseDown(e) {
if (isRightClick(e)) {
return;
}
utils.css.add(dom.o, 'grabbing');
utils.events.add(document, 'mousemove', handleMouse);
utils.events.add(document, 'touchmove', handleMouse);
utils.events.add(document, 'mouseup', releaseMouse);
utils.events.add(document, 'touchend', releaseMouse);
handleMouse(e);
}
function handleClick(e) {
var evt,
target,
offset,
targetNodeName,
methodName,
href,
handled;
evt = (e || window.event);
target = evt.target || evt.srcElement;
if (target && target.nodeName) {
targetNodeName = target.nodeName.toLowerCase();
if (targetNodeName !== 'a') {
if (target.parentNode) {
do {
target = target.parentNode;
targetNodeName = target.nodeName.toLowerCase();
} while (targetNodeName !== 'a' && target.parentNode);
if (!target) {
return false;
}
}
}
if (targetNodeName === 'a') {
href = target.href;
if (soundManager.canPlayURL(href)) {
if (!utils.css.has(target, playerOptions.excludeClass)) {
playLink(target);
handled = true;
}
} else {
offset = target.href.lastIndexOf('#');
if (offset !== -1) {
methodName = target.href.substr(offset + 1);
if (methodName && actions[methodName]) {
handled = true;
actions[methodName](e);
}
}
}
if (handled) {
return utils.events.preventDefault(evt);
}
}
}
return true;
}
function init() {
if (!playerNode && window.console && console.warn) {
console.warn('init(): No playerNode element?');
}
dom.o = playerNode;
if (window.navigator.userAgent.match(/msie [678]/i)) {
utils.css.add(dom.o, css.legacy);
}
if (window.navigator.userAgent.match(/mobile/i)) {
utils.css.add(dom.o, css.noVolume);
}
dom.progress = utils.dom.get(dom.o, '.sm2-progress-ball');
dom.progressTrack = utils.dom.get(dom.o, '.sm2-progress-track');
dom.progressBar = utils.dom.get(dom.o, '.sm2-progress-bar');
dom.volume = utils.dom.get(dom.o, 'a.sm2-volume-control');
if (dom.volume) {
getActionData(dom.volume);
}
dom.duration = utils.dom.get(dom.o, '.sm2-inline-duration');
dom.time = utils.dom.get(dom.o, '.sm2-inline-time');
playlistController = new PlaylistController();
defaultItem = playlistController.getItem(0);
playlistController.select(defaultItem);
if (defaultItem) {
setTitle(defaultItem);
}
utils.events.add(dom.o, 'mousedown', handleMouseDown);
utils.events.add(dom.o, 'touchstart', handleMouseDown);
utils.events.add(dom.o, 'click', handleClick);
utils.events.add(dom.progressTrack, 'mousedown', handleProgressMouseDown);
utils.events.add(dom.progressTrack, 'touchstart', handleProgressMouseDown);
}
actionData = {
volume: {
x: 0,
y: 0,
width: 0,
height: 0,
backgroundSize: 0
}
};
actions = {
play: function(offsetOrEvent) {
/**
* This is an overloaded function that takes mouse/touch events or offset-based item indices.
* Remember, "auto-play" will not work on mobile devices unless this function is called immediately from a touch or click event.
* If you have the link but not the offset, you can also pass a fake event object with a target of an <a> inside the playlist - e.g. { target: someMP3Link }
*/
var target,
href,
e;
if (offsetOrEvent !== undefined && !isNaN(offsetOrEvent)) {
playlistController.playItemByOffset(offsetOrEvent);
return;
}
e = offsetOrEvent;
if (e && e.target) {
target = e.target || e.srcElement;
href = target.href;
}
if (!href || href.indexOf('#') !== -1) {
href = dom.playlist.getElementsByTagName('a')[0].href;
}
if (!soundObject) {
soundObject = makeSound(href);
}
if (!soundObject.playState) {
stopOtherSounds();
}
soundObject.togglePause();
if (soundObject.paused && playlistController.data.timer) {
window.clearTimeout(playlistController.data.timer);
playlistController.data.timer = null;
}
},
pause: function() {
if (soundObject && soundObject.readyState) {
soundObject.pause();
}
},
resume: function() {
if (soundObject && soundObject.readyState) {
soundObject.resume();
}
},
stop: function() {
return actions.pause();
},
next: function(/* e */) {
var item, lastIndex;
if (playlistController.data.timer) {
window.clearTimeout(playlistController.data.timer);
playlistController.data.timer = null;
}
lastIndex = playlistController.data.selectedIndex;
item = playlistController.getNext(true);
if (item && playlistController.data.selectedIndex !== lastIndex) {
playLink(item.getElementsByTagName('a')[0]);
}
},
prev: function(/* e */) {
var item, lastIndex;
lastIndex = playlistController.data.selectedIndex;
item = playlistController.getPrevious();
if (item && playlistController.data.selectedIndex !== lastIndex) {
playLink(item.getElementsByTagName('a')[0]);
}
},
shuffle: function(e) {
var target = (e ? e.target || e.srcElement : utils.dom.get(dom.o, '.shuffle'));
if (target && !utils.css.has(target, css.disabled)) {
utils.css.toggle(target.parentNode, css.active);
playlistController.data.shuffleMode = !playlistController.data.shuffleMode;
}
},
repeat: function(e) {
var target = (e ? e.target || e.srcElement : utils.dom.get(dom.o, '.repeat'));
if (target && !utils.css.has(target, css.disabled)) {
utils.css.toggle(target.parentNode, css.active);
playlistController.data.loopMode = !playlistController.data.loopMode;
}
},
menu: function(ignoreToggle) {
var isOpen;
isOpen = utils.css.has(dom.o, css.playlistOpen);
if (playlistController && !playlistController.data.selectedIndex && !firstOpen) {
dom.playlist.scrollTop = 0;
firstOpen = true;
}
if (typeof ignoreToggle !== 'boolean' || !ignoreToggle) {
if (!isOpen) {
dom.playlistContainer.style.height = '0px';
}
isOpen = utils.css.toggle(dom.o, css.playlistOpen);
}
dom.playlistContainer.style.height = (isOpen ? dom.playlistContainer.scrollHeight : 0) + 'px';
},
adjustVolume: function(e) {
/**
* NOTE: this is the mousemove() event handler version.
* Use setVolume(50), etc., to assign volume directly.
*/
var backgroundMargin,
pixelMargin,
target,
value,
volume;
value = 0;
target = dom.volume;
if (e === undefined) {
return false;
}
var clientX = utils.events.getClientX(e);
if (!e || clientX === undefined) {
if (arguments.length && window.console && window.console.warn) {
console.warn('Bar UI: call setVolume(' + e + ') instead of adjustVolume(' + e + ').');
}
return actions.setVolume.apply(this, arguments);
}
backgroundMargin = (100 - actionData.volume.backgroundSize) / 2;
value = Math.max(0, Math.min(1, (clientX - actionData.volume.x) / actionData.volume.width));
target.style.clip = 'rect(0px, ' + (actionData.volume.width * value) + 'px, ' + actionData.volume.height + 'px, ' + (actionData.volume.width * (backgroundMargin / 100)) + 'px)';
pixelMargin = ((backgroundMargin / 100) * actionData.volume.width);
volume = Math.max(0, Math.min(1, ((clientX - actionData.volume.x) - pixelMargin) / (actionData.volume.width - (pixelMargin * 2)))) * 100;
if (soundObject) {
soundObject.setVolume(volume);
}
defaultVolume = volume;
return utils.events.preventDefault(e);
},
releaseVolume: function(/* e */) {
utils.events.remove(document, 'mousemove', actions.adjustVolume);
utils.events.remove(document, 'touchmove', actions.adjustVolume);
utils.events.remove(document, 'mouseup', actions.releaseVolume);
utils.events.remove(document, 'touchend', actions.releaseVolume);
},
setVolume: function(volume) {
var backgroundSize,
backgroundMargin,
backgroundOffset,
target,
from,
to;
if (volume === undefined || isNaN(volume)) {
return;
}
if (dom.volume) {
target = dom.volume;
backgroundSize = actionData.volume.backgroundSize;
backgroundMargin = (100 - backgroundSize) / 2;
backgroundOffset = actionData.volume.width * (backgroundMargin / 100);
from = backgroundOffset;
to = from + ((actionData.volume.width - (backgroundOffset * 2)) * (volume / 100));
target.style.clip = 'rect(0px, ' + to + 'px, ' + actionData.volume.height + 'px, ' + from + 'px)';
}
if (soundObject) {
soundObject.setVolume(volume);
}
defaultVolume = volume;
}
};
init();
exports = {
on: null,
actions: actions,
dom: dom,
playlistController: playlistController
};
return exports;
};
utils = {
array: (function() {
function compare(property) {
var result;
return function(a, b) {
if (a[property] < b[property]) {
result = -1;
} else if (a[property] > b[property]) {
result = 1;
} else {
result = 0;
}
return result;
};
}
function shuffle(array) {
var i, j, temp;
for (i = array.length - 1; i > 0; i--) {
j = Math.floor(Math.random() * (i + 1));
temp = array[i];
array[i] = array[j];
array[j] = temp;
}
return array;
}
return {
compare: compare,
shuffle: shuffle
};
}()),
css: (function() {
function hasClass(o, cStr) {
return (o.className !== undefined ? new RegExp('(^|\\s)' + cStr + '(\\s|$)').test(o.className) : false);
}
function addClass(o, cStr) {
if (!o || !cStr || hasClass(o, cStr)) {
return; // safety net
}
o.className = (o.className ? o.className + ' ' : '') + cStr;
}
function removeClass(o, cStr) {
if (!o || !cStr || !hasClass(o, cStr)) {
return;
}
o.className = o.className.replace(new RegExp('( ' + cStr + ')|(' + cStr + ')', 'g'), '');
}
function swapClass(o, cStr1, cStr2) {
var tmpClass = {
className: o.className
};
removeClass(tmpClass, cStr1);
addClass(tmpClass, cStr2);
o.className = tmpClass.className;
}
function toggleClass(o, cStr) {
var found,
method;
found = hasClass(o, cStr);
method = (found ? removeClass : addClass);
method(o, cStr);
return !found;
}
return {
has: hasClass,
add: addClass,
remove: removeClass,
swap: swapClass,
toggle: toggleClass
};
}()),
dom: (function() {
function getAll(param1, param2) {
var node,
selector,
results;
if (arguments.length === 1) {
node = document.documentElement;
selector = param1;
} else {
node = param1;
selector = param2;
}
if (node && node.querySelectorAll) {
results = node.querySelectorAll(selector);
}
return results;
}
function get(/* parentNode, selector */) {
var results = getAll.apply(this, arguments);
if (results && results.length) {
return results[results.length - 1];
}
return results && results.length === 0 ? null : results;
}
function ancestor(nodeName, element, checkCurrent) {
if (!element || !nodeName) {
return element;
}
nodeName = nodeName.toUpperCase();
if (checkCurrent && element && element.nodeName === nodeName) {
return element;
}
while (element && element.nodeName !== nodeName && element.parentNode) {
element = element.parentNode;
}
return (element && element.nodeName === nodeName ? element : null);
}
return {
ancestor: ancestor,
get: get,
getAll: getAll
};
}()),
position: (function() {
function getOffX(o) {
var curleft = 0;
if (o.offsetParent) {
while (o.offsetParent) {
curleft += o.offsetLeft;
o = o.offsetParent;
}
} else if (o.x) {
curleft += o.x;
}
return curleft;
}
function getOffY(o) {
var curtop = 0;
if (o.offsetParent) {
while (o.offsetParent) {
curtop += o.offsetTop;
o = o.offsetParent;
}
} else if (o.y) {
curtop += o.y;
}
return curtop;
}
return {
getOffX: getOffX,
getOffY: getOffY
};
}()),
style: (function() {
function get(node, styleProp) {
var value;
if (node.currentStyle) {
value = node.currentStyle[styleProp];
} else if (window.getComputedStyle) {
value = document.defaultView.getComputedStyle(node, null).getPropertyValue(styleProp);
}
return value;
}
return {
get: get
};
}()),
events: (function() {
var add, remove, preventDefault, getClientX;
add = function(o, evtName, evtHandler) {
var eventObject = {
detach: function() {
return remove(o, evtName, evtHandler);
}
};
if (window.addEventListener) {
o.addEventListener(evtName, evtHandler, false);
} else {
o.attachEvent('on' + evtName, evtHandler);
}
return eventObject;
};
remove = (window.removeEventListener !== undefined ? function(o, evtName, evtHandler) {
return o.removeEventListener(evtName, evtHandler, false);
} : function(o, evtName, evtHandler) {
return o.detachEvent('on' + evtName, evtHandler);
});
preventDefault = function(e) {
if (e.preventDefault) {
e.preventDefault();
} else {
e.returnValue = false;
e.cancelBubble = true;
}
return false;
};
getClientX = function(e) {
return (e && (e.clientX || (e.touches && e.touches[0] && e.touches[0].pageX)));
};
return {
add: add,
preventDefault: preventDefault,
remove: remove,
getClientX: getClientX
};
}()),
features: (function() {
var getAnimationFrame,
localAnimationFrame,
localFeatures,
prop,
styles,
testDiv,
transform;
testDiv = document.createElement('div');
/**
* hat tip: paul irish
* http://paulirish.com/2011/requestanimationframe-for-smart-animating/
* https://gist.github.com/838785
*/
localAnimationFrame = (window.requestAnimationFrame
|| window.webkitRequestAnimationFrame
|| window.mozRequestAnimationFrame
|| window.oRequestAnimationFrame
|| window.msRequestAnimationFrame
|| null);
getAnimationFrame = localAnimationFrame ? function() {
return localAnimationFrame.apply(window, arguments);
} : null;
function has(propName) {
return (testDiv.style[propName] !== undefined ? propName : null);
}
localFeatures = {
transform: {
ie: has('-ms-transform'),
moz: has('MozTransform'),
opera: has('OTransform'),
webkit: has('webkitTransform'),
w3: has('transform'),
prop: null // the normalized property value
},
rotate: {
has3D: false,
prop: null
},
getAnimationFrame: getAnimationFrame
};
localFeatures.transform.prop = (
localFeatures.transform.w3 ||
localFeatures.transform.moz ||
localFeatures.transform.webkit ||
localFeatures.transform.ie ||
localFeatures.transform.opera
);
function attempt(style) {
try {
testDiv.style[transform] = style;
} catch(e) {
return false;
}
return !!testDiv.style[transform];
}
if (localFeatures.transform.prop) {
transform = localFeatures.transform.prop;
styles = {
css_2d: 'rotate(0deg)',
css_3d: 'rotate3d(0,0,0,0deg)'
};
if (attempt(styles.css_3d)) {
localFeatures.rotate.has3D = true;
prop = 'rotate3d';
} else if (attempt(styles.css_2d)) {
prop = 'rotate';
}
localFeatures.rotate.prop = prop;
}
testDiv = null;
return localFeatures;
}())
};
window.sm2BarPlayers = players;
window.sm2BarPlayerOptions = playerOptions;
window.SM2BarPlayer = Player;
}(window));
