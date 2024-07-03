import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../components/custom-snackbar/custom-snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showLoading(message: string) {
    this.snackBar.openFromComponent(
    CustomSnackbarComponent,

      {
        duration:0,
        panelClass: ['blue-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        data: { message, isLoading: true },
      }
    );
  }

  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['green-snackbar'],

    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['red-snackbar'],

    });
  }

  hide() {
    this.snackBar.dismiss();
  }
}
