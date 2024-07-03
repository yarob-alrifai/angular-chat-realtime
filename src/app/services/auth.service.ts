import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  authState,
  createUserWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = authState(this.auth);

  constructor(private auth: Auth) {}

  signUp(email: string, password: string): Observable<UserCredential> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      catchError((error) => {
        let errorMessage = 'Unknown error occurred';

        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Email already in use';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email format';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Operation not allowed';
            break;
          case 'auth/weak-password':
            errorMessage =
              'Weak password. Password should be at least 6 characters';
            break;

          default:
            errorMessage = error.message;
            break;
        }

        return throwError(errorMessage);
      })
    );
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      catchError((error) => {
        let errorMessage = 'Unknown error occurred';

        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'User not found';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password';
            break;

          default:
            errorMessage = error.message;
            break;
        }

        return throwError(errorMessage);
      })
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
      return of(null as T);
    };
  }
}
