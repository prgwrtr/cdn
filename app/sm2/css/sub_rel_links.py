#!/usr/bin/env python3.6

""" substitute relative links in the CSS by their absolute CDN paths

    The relative paths should work in theory,
    but more often than not (especially during version transitions)
    url(../image/xxx.png) would be translated by the browser as url(../../image/xxx.png)
    producing an error
"""

import os, glob, io, re

original_dir = "original"

def sub_rel_links(src_file):
    abs_cdn_root = "https://cdn.jsdelivr.net/gh/prgwrtr/cdn@latest/app/sm2" 

    target_file = os.path.basename(src_file)
    lines = io.open(src_file, encoding="utf-8").readlines()
    count = 0
    for i in range(len(lines)):
        s = lines[i]
        m = re.search(r'url\(\.\.(/[^)]*?)\)', s)
        if m:
            rel_path = m.group(1)
            abs_cdn_url = abs_cdn_root + rel_path
            #print(rel_path, "=>", abs_cdn_url)
            #print(s)
            s = s[:m.start(0)] + 'url("' + abs_cdn_url + '")' + s[m.end(0):]
            #print(s)
            lines[i] = s
            count += 1

    print(src_file, "=>", target_file, count, "changes")
    io.open(target_file, "w", encoding="utf-8").writelines(lines)



if __name__ == "__main__":
    original_files = glob.glob(os.path.join(original_dir, "*.css"))
    for original_file in original_files:
        sub_rel_links(original_file)

