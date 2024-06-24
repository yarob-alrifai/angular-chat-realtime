import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  authState,
  createUserWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = authState(this.auth);

  constructor(private auth: Auth) {}

  signUp(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      catchError(this.handleError<UserCredential>('signUp'))
    );
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      catchError(this.handleError<UserCredential>('login'))
    );
  }

  logout(): Observable<void> {
    return from(this.auth.signOut()).pipe(
      catchError(this.handleError<void>('logout'))
    );
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(null as T);
    };
  }
}
