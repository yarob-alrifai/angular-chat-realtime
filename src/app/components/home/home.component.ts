import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  Observable,
  combineLatest,
  startWith,
  map,
  find,
  switchMap,
  tap,
  of,
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
  constructor(
    public authService: AuthService,
    private userService: UserService,
    private chatsService: ChatsService
  ) {}

  // sun **************************************  start normal decleration   **************************************
  // cloud  view child

  @ViewChild('endOfChat') endOfChat: ElementRef | undefined;

  // cloud form control
  searchControl = new FormControl('');
  chatListControl = new FormControl(['']);
  messageControl = new FormControl('');

  // sun  ************************************** end normal  decleration **************************************




  // red ************************************** start  decleration for the observable **************************************
  myChats$ = this.chatsService.myChats$;
  user$: Observable<ProfileUser | null> = this.userService.currentUserProfile$;

  // red ************************************** end  decleration for the observable **************************************






  // orange  ************************************** start complex  decleration **************************************

  // cloud
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

  messages$ = this.chatListControl.valueChanges.pipe(
    map((value) => (value ? value[0] : null)),
    switchMap((chatId) => this.chatsService.getChatMessages$(chatId as string)),
    tap(() => this.scrollToBottom())
  );

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
  // orange  ************************************** end complex  decleration **************************************





  // green   ************************************** start  functions  **************************************

  // cloud send message
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

  // cloud scroll to the bottom
  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // cloud create chat
  createChat(otherUser: ProfileUser) {
    this.chatsService
      .isExistingChat(otherUser.uid)
      .pipe(
        switchMap((chatId) => {
          if (chatId) return of(chatId);
          else return this.chatsService.createChat(otherUser);
        })
      )
      .subscribe((chatId) => {
        this.chatListControl.setValue([chatId]);
      });

    this.chatsService.createChat(otherUser).subscribe();
  }

  // green   ************************************** end  functions  **************************************
}
