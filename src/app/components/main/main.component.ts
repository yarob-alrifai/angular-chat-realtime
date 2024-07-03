import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ProfileUser } from '../../models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styles: ``
})
export class MainComponent {

  constructor(
    public authService: AuthService,
    private userService:UserService
  ) {}
// green get user data from the user services
  user$: Observable<ProfileUser | null> = this.userService.currentUserProfile$;



}
