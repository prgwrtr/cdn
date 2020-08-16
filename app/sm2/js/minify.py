#!/usr/bin/env python
import os, sys

''' doesn't work '''

def minify(fn):
    x = os.path.splitext(fn)
    minfn = x[0] + ".min" + x[1]
    #cmd = "curl -X POST -s --date-urlencode 'input@%s' https://javascript-minifier.com/raw > %s" % (fn, minfn)
    cmd = "wget --post-data=\"`cat %s`\" --output-document=%s https://javascript-minifier.com/raw" % (fn, minfn)
    os.system(cmd)

fnin = "bar-ui.js"
if len(sys.argv) > 1:
    fnin = sys.argv[1]
minify(fnin)
