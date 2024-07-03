import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { MainComponent } from './components/main/main.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import { DateDisplayPipe } from './pipes/date-display.pipe';
import { DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from './components/custom-snackbar/custom-snackbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SnackbarService } from './services/snackbar.service';
const angularMaterial = [
  MatToolbarModule,MatDividerModule,
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatMenuModule,
  MatInputModule,
  ReactiveFormsModule,
  MatAutocompleteModule,
  MatSidenavModule,MatSnackBarModule,MatProgressSpinnerModule
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    HomeComponent,
    MainComponent,
    DateDisplayPipe,
    CustomSnackbarComponent,

  ],
  imports: [BrowserModule, AppRoutingModule, angularMaterial,BrowserAnimationsModule],
  providers: [
    DatePipe,
    provideClientHydration(),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'test-f8881',
        appId: '1:344193245290:web:3a60e3305b5a2a9c4fea13',
        storageBucket: 'test-f8881.appspot.com',
        apiKey: 'AIzaSyAysH8mRYPJOh3aqldldRQFHjMnJWX8kO4',
        authDomain: 'test-f8881.firebaseapp.com',
        messagingSenderId: '344193245290',
        measurementId: 'G-Z9PEVHWPX3',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),SnackbarService

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
