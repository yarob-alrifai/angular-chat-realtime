import { Injectable } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  UploadResult,
} from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  constructor(private storage: Storage, private snackBar: SnackbarService) {}

  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));

    return uploadTask.pipe(
      switchMap((result: UploadResult) => {
        return from(getDownloadURL(result.ref));
      }),
      catchError((error) => {
        this.snackBar.showError(error);
        console.error('Error uploading image:', error);
        throw error;
      })
    );
  }
}
