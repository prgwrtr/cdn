#!/usr/bin/env python3.6
#import urllib
import requests

''' purge the jsDelivr CDN latest version
    so that they are up to date '''
def jsdelivr_purge(user, repo, vers, fns, verbose = False):
    if not "" in vers:
        vers.append("")
    if not "latest" in vers:
        vers.append("latest")

    for fn in fns:
        # call the jsdelivr purge API
        for ver in vers:
            if ver != "":
                ver1 = "@" + ver
            else:
                ver1 = ""

            for minify in (0, 1):
                fn1 = fn
                if minify:
                    if fn.endswith(".js"):
                        fn1 = fn[:-3] + ".min.js"
                    elif fn.endswith(".css"):
                        fn1 = fn[:-4] + ".min.css"

                path = "gh/%s/%s%s/%s" % (user, repo, ver1, fn1)
                url = "https://purge.jsdelivr.net/" + path
                print ("purging https://cdn.jsdelivr.net/" + path + " ...")
                #f = urllib.urlopen(url)
                r = requests.get(url)
                if verbose:
                    #print (f.read() + "\n")
                    print (r.text + "\n")

jsdelivr_purge("prgwrtr", "cdn",
    [], # ["0","0.1"],
    [
        "app/splayer/js/splayer.js",
        "app/sm2/css/bar-ui.css",
        "app/sm2/css/bar-ui-patch.css",
        "app/sm2/js/mbuembed.js",
        #"app/sm2/js/bar-ui.js",
        #"app/sm2/js/bar-ui-jsmin.js",
        #"app/sm2/js/sm2-bar-ui.js",
        #"app/css/ed.css",
        #"app/css/ver.css",
        "app/css/mkmedia.css",
        #"app/js/addsp.js",
        #"app/js/bsw.js",
        #"app/js/common1.js",
        "app/js/domainmap.js",
        "app/js/dmapdata.js",
        "app/js/ed.js",
        "app/js/mediacom.js",
        "app/js/mkmedia.js",
        "app/js/redir.js",
        "app/js/sm2ls.js",
        #"app/js/ver.js",
        #"app/js/wgen.js",
        #"app/sm2/Sound/bar-ui.css",
    ],
verbose = True)

