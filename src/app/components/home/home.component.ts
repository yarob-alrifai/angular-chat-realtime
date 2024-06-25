import { Component } from '@angular/core';
import { Observable, combineLatest, startWith, map } from 'rxjs';
import { ProfileUser } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { FormControl } from '@angular/forms';
import { ChatsService } from '../../services/chats.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  searchControl = new FormControl('');
  constructor(
    public authService: AuthService,
    private userService: UserService,
    private chatsService: ChatsService
  ) {}

  // fire observe
  myChats$ = this.chatsService.myChats$
  // green get user data from the user services
  user$: Observable<ProfileUser | null> = this.userService.currentUserProfile$;
  users$ = combineLatest([
    this.userService.allUsers,
    this.user$,
    this.searchControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([users, user, searchString]) =>
      users.filter((u) => u.uid !== user?.uid &&
        u.displayName?.toLowerCase().includes((searchString ?? "").toLowerCase())
      )
    )
  );

   // green create chat function
   createChat(otherUser: ProfileUser){
    this.chatsService.createChat(otherUser).subscribe()
  }


}
