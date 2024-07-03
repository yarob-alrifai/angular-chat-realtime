import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent implements OnInit {
  // green create login form group
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // green submit data to login
  submit() {
    this.snackBar.showLoading('Logging in... ');
    const { email, password } = this.loginForm.value;
    if (!this.loginForm.valid || !email || !password) {
      return;
    }
    this.authService.login(email, password).subscribe({
      next: () => {
        this.snackBar.showSuccess('Logged in successfully !');
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        this.snackBar.hide();
        this.snackBar.showError(` ${error}`);
      },
    });
  }
}
