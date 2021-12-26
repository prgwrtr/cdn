# Sm2ls

## List of files

Directory/File        | Description
----------------------|-------------------------------------------
Sound                 | the js, css, images files used in standard xlfm forums
Sound/bar-ui.css      | the original bar-ui CSS, as used in xlfm forums, using the images in Sound/image directory, containing modifcations from the original authors
css                   | modified css files and patches
js                    | js files
js/mbuembed.js        | self-installation script
js/soundmanager2.js   | original soundmanager.js
js/bar-ui.js          | slightly modified bar-ui.js (compatible with the original one)
js/sm2-bar-ui.js      | combination of JavaScripts soundmanager2.js and bar-ui.js (original, not modified)
image                 | adapted image files for modified bar-ui.css
swf                   | Flash plugins comes with the original package, seldom used now
tests                 | testing web pages
discuz                | installation files for Discuz! forums
notes                 | notes for developers

### Discuz! forum modifications

js/mbuembed-disabler.js     | disabler for dynamic mbuembed.js
js/mbuembed-static.js       | static version of mbuembed.js

The key of installation is to modify `viewthread.htm` in the forum templates

```html
<script src="./m/v/mbuembed-static.js"></script>

...

<link rel="stylesheet" href="./voice/Sound/bar-ui.css">
<script src="./m/v/soundmanager2.js"></script>
<script src="./m/v/bar-ui.js"></script>
<link rel="stylesheet" href="./voice/Sound/patch/bar-ui-patch.css">
<script src="./m/v/mbuembed-static.js"></script>
```

### Original files

soundmanager2 downloaded from the official site are saved in XinLingFaMen/web/misc/

