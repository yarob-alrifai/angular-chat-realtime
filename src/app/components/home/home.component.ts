import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileUser } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(
    public authService: AuthService,
    private userService:UserService
  ) {}
// green get user data from the user services
  user$: Observable<ProfileUser | null> = this.userService.currentUserProfile$;



}
