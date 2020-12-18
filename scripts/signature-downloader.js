// Create data url from canvas and download a png
function convertToImage() {
  const canvas = document.querySelector('canvas');
  const canvasImageData = canvas.toDataURL('image/png');
  anchor = document.createElement('a');

  anchor.download = 'signature.png';
  anchor.href = canvasImageData;
  anchor.click();
}
