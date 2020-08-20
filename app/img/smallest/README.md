# Overview

Smallest image files

https://github.com/mathiasbynens/small/

# GIF

## <img> tag

<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">

# BMP

## <img>

For `bmp-white-dot.bmp`
<img src="data:image/bmp;base64,Qk0eAAAAAAAAABoAAAAMAAAAAQABAAEAGAD///8A">

## How to change

1. Create the hexdump
```
xxd bmp.bmp > bmp.txt
```

2. Edit the hex dump `bmp.txt`

3. Create a new file from the modified hexdump
```
xxd -r bmp.txt > bmp-new.bmp
```

## BMP format
[Wikipedia:BMP file format](https://en.wikipedia.org/wiki/BMP_file_format)

00000000: 424d 1e00 0000 0000 0000 1a00 0000 0c00  BM..............
00000010: 0000 0100 0100 0100 1800 ffff ff00       ..............

### Bitmap file header (14 bytes)

BM (2 bytes): 424d

File size = 30 bytes (4 bytes): 1e00 0000

Reserved (2 bytes): 00

Reserved (2 bytes): 00

Offset to pixel array = 26 (4 bytes): 1a00 0000


### DIB header (12 bytes)

The header type is the 12-bytes BITMAPCOREHEADER OS21XBITMAPHEADER


Size of this header = 12 (4 bytes):  0c00 0000

Bitmap width in pixels = 1 (2 bytes): 0100

Bitmap height in pixels = 1 (2 bytes): 0100

Number of color planes = 1  (2 bytes): 0100

Number of bits per pixel = 24 (2 bytes): 1800


### Pixel array
ff ff ff for white
00 for the padding
