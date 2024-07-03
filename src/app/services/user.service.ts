import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
  query,
} from '@angular/fire/firestore';
import { catchError, from, Observable, of, switchMap, throwError } from 'rxjs';
import { ProfileUser } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user: ProfileUser) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }

  addUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }




  updateUser(user: ProfileUser): Observable<void> {
    const userRef = doc(this.firestore, 'users', user.uid);

    return from(updateDoc(userRef, { ...user })).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }


  get allUsers(): Observable<ProfileUser[]> {
    const ref = collection(this.firestore, 'users');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<ProfileUser[]>;
  }
}
