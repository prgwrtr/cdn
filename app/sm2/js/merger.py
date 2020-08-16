#!/usr/bin/env python
import io, re

def my_trim(s):
    for i in range(len(s)):
        ln = s[i]
        # remove leading and trailing spaces
        ln = re.sub(ur"^\s+|\s+$", u"", ln)
        # remove line comments
        if ln.startswith("//"):
            ln = u""
        if ln != u"":
            ln += u"\n"
        s[i] = ln
    return s


s1 = io.open("soundmanager2-nodebug-jsmin.js", encoding="UTF-8").readlines()

# NOTE: using the minimized js for bar-ui.js, which may not work
# the jsdelivr minimized bar-ui.js appeared to break the play/pause button
# but the jsdelivr minified and bar-ui-jsmin.js are basically the same
# so this problem may pop up again in the future
#bar_ui_js = "bar-ui.js"
bar_ui_js = "bar-ui-jsmin.js"
s2 = io.open(bar_ui_js, encoding="UTF-8").readlines()
s2 = my_trim(s2)

s = s1 + s2
io.open("sm2-bar-ui.js", "w", encoding="UTF-8").writelines(s)
