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

const angularMaterial = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatMenuModule,
  MatInputModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    HomeComponent,
    MainComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, angularMaterial],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyAysH8mRYPJOh3aqldldRQFHjMnJWX8kO4",
        authDomain: "test-f8881.firebaseapp.com",
        projectId: "test-f8881",
        storageBucket: "test-f8881.appspot.com",
        messagingSenderId: "344193245290",
        appId: "1:344193245290:web:816bd78fb0f38f894fea13",
        measurementId: "G-8T2TBZVNMM"
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
