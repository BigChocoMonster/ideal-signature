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

// Stopping weird form submission page reloads
document.forms.signature.addEventListener('submit', (event) => {
  event.preventDefault();
});

// Initialising canvas text
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
context.font = '70px BillionReach';
context.textBaseline = 'middle';
context.textAlign = 'center';

// Drawing to canvas on font load
const font = new FontFace(
  'BillionReach',
  'url(./fonts/billion_reach/BillionReach.otf)'
);
font.load().then(() => {
  writeToCanvas(document.forms.signature.name.value);

  document.forms.signature.name.addEventListener('input', (event) => {
    writeToCanvas(event.target.value);
  });
});

function writeToCanvas(text) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text || 'I am neu-d', canvas.width / 2, canvas.height / 2);
}
