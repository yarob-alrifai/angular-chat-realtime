import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import {
  Observable,
  combineLatest,
  startWith,
  map,
  find,
  switchMap,
  tap,
} from 'rxjs';
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
  @ViewChild('endOfChat') endOfChat: ElementRef | undefined;
  searchControl = new FormControl('');
  chatListControl = new FormControl('');
  messageControl = new FormControl('');
  constructor(
    public authService: AuthService,
    private userService: UserService,
    private chatsService: ChatsService
  ) {}

  // fire observe
  myChats$ = this.chatsService.myChats$;
  // green get user data from the user services
  user$: Observable<ProfileUser | null> = this.userService.currentUserProfile$;
  users$ = combineLatest([
    this.userService.allUsers,
    this.user$,
    this.searchControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([users, user, searchString]) =>
      users.filter(
        (u) =>
          u.uid !== user?.uid &&
          u.displayName
            ?.toLowerCase()
            .includes((searchString ?? '').toLowerCase())
      )
    )
  );

  selectedChat$ = combineLatest([
    this.chatListControl.valueChanges.pipe(startWith([])),
    this.myChats$,
  ]).pipe(
    map(([value, chats]) => {
      if (!value || value.length === 0) {
        return null;
      }
      const selectedId = value[0];
      return chats.find((c) => c.id === selectedId) || null;
    })
  );

  // green get all messges for the chat
  messages$ = this.chatListControl.valueChanges.pipe(
    map((value) => (value ? value[0] : null)),
    switchMap((chatId) => this.chatsService.getChatMessages$(chatId as string)),
    tap(() => this.scrollToBottom())
  );
  // green create chat function
  createChat(otherUser: ProfileUser) {
    this.chatsService.createChat(otherUser).subscribe();
  }

  // green send message function
  sendMessage() {
    if (
      this.messageControl.valid &&
      this.chatListControl.value &&
      this.chatListControl.value.length > 0
    ) {
      const message = this.messageControl.value ?? '';
      const selectedChatId = this.chatListControl.value[0];
      this.chatsService
        .addChatMessage(selectedChatId, message)
        .subscribe(() => {
          this.messageControl.setValue('');
          this.scrollToBottom();
        });
    }
  }

  // green scroll to the button
  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}
