window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    // browser checks if already registered and handles accordingly across all loads
    navigator.serviceWorker.register('service-worker.js').then(
      (registration) => {
        console.log(
          '%c Success bitches!',
          'color: #24fc03',
          'Scope: ' + registration.scope
        ); // successful registration
      },
      (error) => {
        console.error('Whoops!', 'Error: ' + error); // failed registration
      }
    );
  }
});
