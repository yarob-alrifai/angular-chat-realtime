import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';

// blue validation for passwords
export function passwordsMatchValidators(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password != confirmPassword)
      return { paswordDontMatch: true };
    return null;
  };
}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styles: ``
})
export class SignupComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private snackBar: SnackbarService
  ) {}
  signUpForm = new FormGroup(
    {
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    },
    { validators: passwordsMatchValidators() }
  );

  get name() {
    return this.signUpForm.get('name');
  }
  get email() {
    return this.signUpForm.get('email');
  }
  get password() {
    return this.signUpForm.get('password');
  }
  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  // green submit data to add user
  submit() {
    const { name, email, password } = this.signUpForm.value;
    if (!this.signUpForm.valid || !name || !password || !email) {
      return;
    }
    this.snackBar.showLoading('Signing in... ');
    this.authService
      .signUp(email, password)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.userService.addUser({ uid, email, displayName: name })
        )
      )
      .subscribe({
        next: () => {
          this.snackBar.showSuccess('Signed up successfully!'),
            this.router.navigate(['/profile']);
        },
        error: (error) => {
          this.snackBar.hide();
          this.snackBar.showError(` ${error}`);
        },
      });
  }
}
