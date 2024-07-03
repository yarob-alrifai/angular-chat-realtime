import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import {
  Observable,
  combineLatest,
  startWith,
  map,
  switchMap,
  tap,
  of,
  catchError,
  take,
} from 'rxjs';
import { ProfileUser } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { FormControl } from '@angular/forms';
import { ChatsService } from '../../services/chats.service';
import { Chat } from '../../models/chat';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewChecked {
  constructor(
    public authService: AuthService,
    private userService: UserService,
    private chatsService: ChatsService,
    private snackBar: SnackbarService
  ) {}
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  // sun **************************************  start normal decleration   **************************************
  // cloud  view child

  @ViewChild('endOfChat') endOfChat: ElementRef | undefined;

  // cloud form control
  searchControl = new FormControl('');
  chatListControl = new FormControl('');
  messageControl = new FormControl();

  selectedChat: any = null;

  // sun  ************************************** end normal  decleration **************************************

  // red ************************************** start  decleration for the observable **************************************
  myChats$ = this.chatsService.myChats$.pipe(
    // take(1),
    tap((res) => console.log(res)),
    catchError((error) => {
      this.snackBar.showError(error)
      return of([]);
    })
  );
  user$: Observable<ProfileUser | null> = this.userService.currentUserProfile$;

  // red ************************************** end  decleration for the observable **************************************

  // orange  ************************************** start complex  decleration **************************************


  messages$ = this.chatListControl.valueChanges.pipe(
    // map((value) => (value ? value[0] : null)),
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

  selectChat(_chat: Chat) {
    this.myChats$
      .pipe(
        map((chats: Chat[]) => chats.find((chat: Chat) => chat.id === _chat.id))
      )
      .subscribe((foundChat: Chat | undefined) => {
        if (foundChat) {
          console.log('Selected Chat ID:', foundChat.id);
          this.selectedChat = foundChat;
          this.chatListControl.setValue(foundChat.id);
        } else {
          console.error('Chat not found!');
        }
      });
  }


  sendMessage() {
    if (this.messageControl.valid && this.messageControl.value && this.chatListControl.value) {
      const message = this.messageControl.value;
      const selectedChatId = this.chatListControl.value;
      this.chatsService.addChatMessage(selectedChatId, message).subscribe(() => {
        this.messageControl.setValue('');
        this.scrollToBottom();
      });
    }
  }


  scrollToBottom() {
    if (this.endOfChat) {
      this.endOfChat.nativeElement.scrollIntoView();
    }
  }


  createChat(otherUser: ProfileUser) {
    this.chatsService
      .isExistingChat(otherUser.uid)
      .pipe(
        switchMap((chatId) => {
          if (chatId) {
            return of(chatId);
          } else {
            return this.chatsService.createChat(otherUser);
          }
        })
      )
      .subscribe((chatId) => {
        if (chatId) {
          this.chatsService.myChats$
            .pipe(
              map((chats: Chat[]) => chats.find((chat) => chat.id === chatId)),
              take(1)
            )
            .subscribe((chat: Chat | undefined) => {
              if (chat) {
                this.selectedChat = chat;
                this.chatListControl.setValue(chat.id);
                this.searchControl.setValue('');
              } else {
                this.snackBar.showError('Created chat not found in chat list')
              }
            });
        }
      });
  }

  // green   ************************************** end  functions  **************************************
}
