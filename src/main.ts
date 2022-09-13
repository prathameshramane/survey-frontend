import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { Workbox } from 'workbox-window';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    registerServiceWorker('service-worker.js')
  })
  .catch(err => console.error(err));


function registerServiceWorker(swName: string) {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox(swName);

    // Confirmation on update being deployed
    wb.addEventListener('installed', event => {
      if (event.isUpdate) {
        if (confirm(`New content is available!. Click OK to refresh`)) {
          window.location.reload();
        }
      }
    });

    wb.register();
  }
}