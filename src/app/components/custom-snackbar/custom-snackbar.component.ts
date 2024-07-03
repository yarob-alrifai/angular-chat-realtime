import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  template: `
    <div class="flex  gap-3">
      <mat-progress-spinner
        *ngIf="data.isLoading"
        mode="indeterminate"
        diameter="24"
      ></mat-progress-spinner>
      <span>{{ data.message }}</span>
    </div>
  `,
  styles: [
    `
      .snackbar-container {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `,
  ],
})
export class CustomSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
