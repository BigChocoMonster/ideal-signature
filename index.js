// Register service worker
window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    // Browser checks if already registered and handles accordingly across all loads
    navigator.serviceWorker.register('service-worker.js').then(
      (registration) => {
        console.log(
          '%c Success bitches!',
          'color: #24fc03',
          'Scope: ' + registration.scope
        ); // Successful registration
      },
      (error) => {
        console.error('Whoops!', 'Error: ' + error); //Failed registration
      }
    );
  }
});

// Stop weird form submission page reloads
document.forms.signature.addEventListener('submit', (event) => {
  event.preventDefault();
});

// Initialise canvas text
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
let font = 70;
context.font = '70px BillionReach';
context.textBaseline = 'middle';
context.textAlign = 'center';

// Draw to canvas when fonts ready
document.fonts.ready.then(() => {
  if (document.fonts.check('1em BillionReach')) {
    writeToCanvas(document.forms.signature.name.value);

    document.forms.signature.name.addEventListener('input', (event) => {
      writeToCanvas(event.target.value);
    });
  } else {
    writeToCanvas("Sorry, fonts didn't load!");
  }
});

// Try to resize font size based on canvas width and write on it
function writeToCanvas(text) {
  const canvasText = text || 'I am neu-d';
  let width = context.measureText(canvasText).width;

  if (width > canvas.width) {
    font -= 5;
  } else if (width < canvas.width && font < 70) {
    font += 5;
  }

  context.font = `${font}px BillionReach`;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(canvasText, canvas.width / 2, canvas.height / 2);
}

// Create data url from canvas and download a png
function convertToImage() {
  const canvasImageData = canvas.toDataURL('image/png');
  anchor = document.createElement('a');

  anchor.download = 'signature.png';
  anchor.href = canvasImageData;
  anchor.click();
}
