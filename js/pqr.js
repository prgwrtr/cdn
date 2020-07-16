"use strict";

var pqrVersion = "V0.33";

function uploadQRImage()
{
/*
  var f_qr = $('#qr-upload')[0].files[0];
  if ( !f_qr ) return;
  var qr_url = URL.createObjectURL( f_qr );
*/
  var img = $('#qr-img');
  //img.prop('src', qr_url);
  img.prop('src', 'https://i.postimg.cc/Kj5t4RyX/lotus1.jpg');
  var canvas = $('#qr-canvas')[0];
  canvas.imgWidth = 0;
  canvas.imgHeight = 0;
  if ( !img.naturalWidth ) {
    $('#qr-img-wrapper').show(); // show the the wrap to get the width and height
  }
  img.load(function() {
    if ( !this.naturalWidth ) {
      canvas.imgWidth = $(this).width();
      canvas.imgHeight = $(this).height();
    } else {
      canvas.imgWidth = img[0].naturalWidth;
      canvas.imgHeight = img[0].naturalHeight;
    }
    $('#qr-img-wrapper').hide();
    updateQRImage();
  });

}



/* References:
   https://jsfiddle.net/MartinThoma/vSDTW/2/ */
function installQRRectSelector()
{
  var canvas = $('#qr-canvas')[0];
  console.log("onmousemove", ("onmousemove" in canvas), "ontouchmove", ("ontouchmove" in canvas));
  if ( "ontouchmove" in canvas ) { // touch is available
    installQRRectTouchSelector();
  } else if ( "onmousemove" in canvas ) { // mouse is available
    installQRRectMouseSelector();
  }
}


function installQRRectTouchSelector()
{
  var canvas = $('#qr-canvas');

  canvas.on('touchstart', function(e) {
    // use e.clientX with rect.left (visual viewport coordinates)
    // or e.pageX with canvas.offsetLeft (page coordinates)
    var touches =  ( e.touches || e.originalEvent.touches );
    this.rect = this.getBoundingClientRect();
    this.x1 = touches[0].clientX - this.rect.left;
    this.y1 = touches[0].clientY - this.rect.top;
    this.isSelectingRect = true;
  });

  canvas.on('touchmove', function(e) {
    if ( this.isSelectingRect ) {
      var touches =  ( e.touches || e.originalEvent.touches );
      this.rect = this.getBoundingClientRect();
      this.x2 = touches[0].clientX - this.rect.left;
      this.y2 = touches[0].clientY - this.rect.top;
      //console.log(this.x1, this.y1, this.x2, this.y2);
      if ( !this.isDrawing ) {
        updateQRImage();
      }
    }
  });

  canvas.on('touchend', function(e) {
    updateQRImage();
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.isSelectingRect = false;
  });
}


function installQRRectMouseSelector()
{
  var canvas = $('#qr-canvas');

  canvas.on('mousedown', function(e) {
    // use e.clientX with rect.left (visual viewport coordinates)
    // or e.pageX with canvas.offsetLeft (page coordinates)
    this.rect = this.getBoundingClientRect();
    //console.log("mousedown", e.clientX, e.clientY, this.rect.left, this.rect.top);
    this.x1 = e.clientX - this.rect.left;
    this.y1 = e.clientY - this.rect.top;
    this.isSelectingRect = true;
  });

  canvas.on('mousemove', function(e) {
    if ( this.isSelectingRect ) {
      this.rect = this.getBoundingClientRect();
      this.x2 = e.clientX - this.rect.left;
      this.y2 = e.clientY - this.rect.top;
      //console.log(this.x1, this.y1, this.x2, this.y2);
      if ( !this.isDrawing ) {
        updateQRImage();
      }
    }
  });

  canvas.on('mouseup', function(e) {
    //updateQRImage();
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.isSelectingRect = false;
  });
}


// draw the QR image,
function updateQRImage()
{
  var canvas = $('#qr-canvas')[0];
  canvas.isDrawing = true; // prevent racing drawing requests

  var imgWidth = canvas.imgWidth;
  var imgHeight = canvas.imgHeight;

  var cWidth = $('#qr-canvas-wrapper').width();
  var cHeight = Math.floor(cWidth*imgHeight/imgWidth+0.5);
  canvas.width = cWidth;
  canvas.height = cHeight;
  //console.log(imgWidth, imgHeight, cWidth, cHeight);
  var ctx = canvas.getContext('2d');
  var img = $('#qr-img');
  //console.log( imgWidth, imgHeight );
  ctx.drawImage(img[0], 0, 0, imgWidth, imgHeight, 0, 0, cWidth, cHeight);

  if ( canvas.isSelectingRect ) {
    var rx0, ry0, rw, rh;
    rx0 = Math.min(canvas.x1, canvas.x2)/cWidth;
    ry0 = Math.min(canvas.y1, canvas.y2)/cHeight;
    rw = Math.abs(canvas.x2 - canvas.x1)/cWidth;
    rh = Math.abs(canvas.y2 - canvas.y1)/cHeight;
    //console.log(canvas.isSelectingRect, rx0, ry0, rw, rh);

    // draw the shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, cWidth, cHeight);

    ctx.drawImage(img[0], rx0*imgWidth, ry0*imgHeight, rw*imgWidth, rh*imgHeight,
      rx0*cWidth, ry0*cHeight, rw*cWidth, rh*cHeight);
  }
  canvas.isDrawing = false;
}


$(document).ready(function () {
  installQRRectSelector();
});
