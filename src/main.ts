import { bootstrapApplication } from '@angular/platform-browser';
import { routes } from './app/app.routes';
import { initializeApp } from 'firebase/app';
import { provideFirebaseApp, getApp, initializeApp as angularInitApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { provideStore, StoreModule } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appReducers } from './app/app.reducer';
import { environment } from './environments/environment';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStore(appReducers),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production })
  ]
});
