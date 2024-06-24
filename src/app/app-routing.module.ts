import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import {canActivate, redirectUnauthorizedTo,redirectLoggedInTo} from '@angular/fire/auth-guard'
import { ProfileComponent } from './components/profile/profile.component';
import { SignupComponent } from './components/signup/signup.component';
import { MainComponent } from './components/main/main.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login'])
const redirectToHome = ()=> redirectLoggedInTo(['home'])
const routes: Routes = [
  { path: '', pathMatch: 'full', component: MainComponent },
  { path: 'main', component: MainComponent },
  { path: 'home', component: HomeComponent,...canActivate(redirectToLogin) },
  { path: 'login', component: LoginComponent ,...canActivate(redirectToHome)},
  { path: 'sign-up', component: SignupComponent ,...canActivate(redirectToHome)},
  { path: 'profile', component: ProfileComponent, ...canActivate(redirectToLogin) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ BrowserModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
