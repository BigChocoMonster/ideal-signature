import { fontFamilies, fontSize } from './constants.js';

// Register service worker
window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    // Browser checks if already registered and handles accordingly across all loads
    navigator.serviceWorker.register('../service-worker.js').then(
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
context.textBaseline = 'middle';
context.textAlign = 'center';

let fontFamily = fontFamilies[0];

// Load all the fonts
for (let font of fontFamilies) {
  document.fonts.load(`1em ${font}`);
}

// Draw to canvas when fonts ready
document.fonts.ready.then(() => {
  writeToCanvas(document.forms.signature.name.value);

  document.forms.signature.name.addEventListener('input', (event) => {
    writeToCanvas(event.target.value);
  });
});

// Write to canvas
function writeToCanvas(text) {
  setContextFont();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text || 'I am neu-d', canvas.width / 2, canvas.height / 2);
}

// Set canvas font settings
function setContextFont() {
  context.font = `${fontSize}px ${fontFamily}`;
}

window.addEventListener('load', () => {
  let isMenuOpen = false;

  const wrapper = document.querySelector('#dropdown');
  const button = document.querySelector('#dropdown > button');
  const menu = document.querySelector('#dropdown > div');

  const menuHeight = menu.firstElementChild.offsetHeight * menu.children.length;

  button.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    wrapper.setAttribute('data-menu', isMenuOpen);

    if (isMenuOpen) {
      menu.style.height = `${menuHeight}px`;
    } else {
      menu.style.height = '';
    }
  });

  for (let child of menu.children) {
    child.addEventListener('click', () => {
      button.innerText = child.innerText;
      button.click();

      fontFamily = child.innerText.replace(/\s/g, '');
      writeToCanvas(document.forms.signature.name.value);
    });
  }
});
