import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ProfileUser } from './models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  user$: Observable<ProfileUser | null> = this.userService.currentUserProfile$;
  photoURL: string | null = null;
  constructor(
    public authService: AuthService,
    private router: Router,
    private userService:UserService
  ) {}

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user) {
        console.log(user.photoURL)
        this.photoURL = user.photoURL || 'assets/images/image-profile.png';
      } else {
        this.photoURL = 'assets/images/image-profile.png';
      }
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['']);
    });
  }
}
