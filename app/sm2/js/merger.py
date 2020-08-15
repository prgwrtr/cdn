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

s1 = io.open("soundmanager2.js", encoding="UTF-8").readlines()
s2 = io.open("bar-ui.js", encoding="UTF-8").readlines()
s = s1 + s2
s = my_trim(s)
io.open("sm2-bar-ui.js", "w", encoding="UTF-8").writelines(s)
