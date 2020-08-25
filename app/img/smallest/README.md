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
xxd bmp.bmp > bmp.hex
```

2. Edit the hex dump `bmp.hex`

3. Create a new file from the modified hexdump
```
xxd -r bmp.hex > bmp-new.bmp
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


## GIF File Format

GIF89a specification:
https://www.w3.org/Graphics/GIF/spec-gif89a.txt

Tutorial
http://giflib.sourceforge.net/whatsinagif/bits_and_bytes.html

### 17. Header.

#### First three bytes (signature)
GIF

#### Next three bytes (version)
89a

### 18. Logical Screen Descriptor.

####  18.0-1 Logical Screen Width (unsigned = 2 bytes)
0x01 0x00

####  18.2-3 Logical Screen Height (unsigned = 2 bytes)
0x01 0x00

####  18.4 Packed Fields (1 byte)
0x00

or 

0x80 for a single Global Color Table

##### Global Color Table Flag       1 Bit

0: No Global Color Table, the Background Color Index filed is meaningless

##### Color Resolution              3 Bits
Number of bits per primary color available to the original image, minus 1

For example, if the value in this field is 3,
then the palette of the original image had 4 bits
per primary color available to create the image.

##### Sort Flag                     1 Bit

Indicates whether the Global Color Table is sorted.

0: Not sorted

##### Size of Global Color Table    3 Bits


#### 18.5 Background Color Index (1 byte)

Index into the Global Color Table for the background color

If the Global Color Table Flag is set to (zero), this field should be zero and should be ignored.

0

#### 18.6 Pixel Aspect Radio (1 byte)

0: No aspect radio information is given

### 19. Global Color Table.

(optional)

If global color Table exists,

3 x 2^(Size of Global Color Table+1) = 3 x 2 = 6



### 23. Graphic Control Extension
Optional only for transparency

#### 23.0 Extension Introducer
0x21

#### 23.1 Graphic Cntrol Label
0xf9

#### 23.0 Block Size
0x04

#### 23.1 Packed Fields
0x01

##### Reserved (3 bits)
0

##### Disposal Method (3 bits)
0: No disposal specified

##### User Input Flag (1 bit)
0: User input is not expected

##### Transparent Color Flag (1 bit, least significant)
0: Transparent Index is not given
1: Transparent Index is given

### 23.2-3 Delay Time (unsigned = 2 bytes)
0x00 0x00

### 23.4 Transparent Color Index
0x00

### 23.0 Block Terminator
0x00


### 20. Image Descriptor.

#### 20.0 Image Separator (1 byte)
0x2c

#### 20.1-2 Image Left Position (unsigned = 2 bytes)
0x00 0x00

#### 20.3-4 Image Right Position (unsigned = 2 bytes)
0x00 0x00

#### 20.5-6 Image Width (unsigned = 2 bytes)
0x01 0x00

#### 20.7-8 Image Height (unsigned = 2 bytes)
0x01 0x00

#### 20.9 Packed Fields (1 byte)
0x00

### 22. Table Based Image Data

For LZW:
https://www2.cs.duke.edu/csed/curious/compression/lzw.html

For GIF:
http://giflib.sourceforge.net/whatsinagif/lzw_image_data.html

#### LZW Minimum Code Size (1 byte)
0x02 (code size = 2)

the minimum number of bits required to represent the set of actual pixel values.

black & white images which have one color bit must be
indicated as having a code size of 2.

```
0x01 0x44 0x00
```



#### Block size (1 byte)
0x01

#### data bytes
0x44 = 01|000|100


Clear code = 2^(code size) = 2^2 = 4 = 100 binary

An End of Information code is defined that explicitly indicates the end of
the image data stream. LZW processing terminates when this code is encountered.
It must be the last code output by the encoder for an image. The value of this
code is <Clear code>+1 = 5 = 101 binary

The top two bits should be the last two bits of "101" (End of Information Code)
To be more formal, so the image data should be

```
0x02 0x44 0x01 0x00
```

Instead of
```
0x01 0x44 0x00
```


#### Block terminitor
0x00


### Trailer
0x3b


# PNG format

http://www.1x1px.me/
