'''
Adapted from 
https://github.com/MaxArt2501/base64-js/blob/master/base64.js
'''
import re, base64

b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
# Regular expression to check formal correctness of base64 encoded strings
b64re = ur"^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$"

def btoa(s, verbose = False):
    rest = len(s) % 3
    print len(s), rest
    result = ""
    i = 0
    while i < len(s):
        a = ord(s[i])
        i += 1
        b = c = 0
        if i < len(s):
            b = ord(s[i])
            i += 1
            if i < len(s):
                c = ord(s[i])
                i += 1
        bitmap = (a << 16) | (b << 8) | c
        if verbose:
            print "%4s %2x %2x %2x %6x"%(i, a, b, c, bitmap)
        result += b64[bitmap >> 18 & 63]
        result += b64[bitmap >> 12 & 63]
        result += b64[bitmap >>  6 & 63]
        result += b64[bitmap       & 63]
    
    if rest:
        result = result[:rest-3] + ("="*(3-rest))
    return result


def atob(s):
    s = re.sub(r"[\t\n\f\r ]+", "", s)
    s += "="*(len(s)&3)
    result = ""
    i = 0
    while i < len(s):
        a = b64.find(s[i])
        i += 1
        b = c = d = 0
        if i < len(s):
            b = b64.find(s[i])
            i += 1
            if i < len(s):
                c = b64.find(s[i])
                i += 1
                if i < len(s):
                    d = b64.find(s[i])
                    i += 1
        bitmap = (a << 18) | (b << 12) | (c << 6) | d
        if c == 64:
            result += chr((bitmap >> 16) & 255)
        elif d == 64:
            result += chr((bitmap >> 16) & 255) + chr((bitmap >> 8) & 255)
        else:
            result += chr((bitmap >> 16) & 255) + chr((bitmap >> 8) & 255) + chr(bitmap & 255)
    return result




def b64decode(fn, sb64):
    with open(fn, "wb") as binary_file:
        data = base64.b64decode( sb64 )
        data1 = atob( sb64 )
        print repr(data)
        print repr(data1)
        binary_file.write( data )


#b64decode("my.gif", "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")

def b64encode(fn, verbose = False):
    with open(fn, "rb") as binary_file:
        data = binary_file.read()
        sb64 = btoa(data, verbose)
        print sb64
        print base64.b64encode(data)
        return sb64

b64encode("gif-transparent.gif", True)
b64encode("gif-white-dot.gif", True)
b64encode("gif-white-dot2.gif", True)

#for fn in ("bmp-white-dot.bmp", "gif-transparent.gif"):
#    print fn, b64encode(fn) 




