import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { ProfileUser } from '../models/user';
import { Observable, concatMap, map, take } from 'rxjs';
import { UserService } from './user.service';
import { Chat } from '../models/chat';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor(
    private fireStrore: Firestore,
    private userService: UserService
  ) {}
  //  green return the id for the new chat
  createChat(otherUser: ProfileUser): Observable<string> {
    const ref = collection(this.fireStrore, 'chats');
    return this.userService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          userIds: [user?.uid, otherUser.uid],
          users: [
            {
              displayName: user?.displayName ?? '',
              photoURL: user?.photoURL ?? '',
            },
            {
              displayName: otherUser?.displayName ?? '',
              photoURL: otherUser?.photoURL ?? '',
            },
          ],
        })
      ),
      map((ref) => ref.id)
    );
  }

  // green get my chats
  get myChats$(): Observable<Chat[]> {
    const ref = collection(this.fireStrore, 'chats');
    return this.userService.currentUserProfile$.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('userIds', 'array-contains', user?.uid)
        );
        return collectionData(myQuery, { idField: 'id' }).pipe(
          map((chats: Chat[]) => this.addChatNameAndPic(user?.uid ?? '', chats))
        ) as Observable<Chat[]>;
      })
    );
  }

  // green add chat name and chat pic
  // fire now we will check every user to get the photo for the another user to display it in the chat list , we do that to get the name and the photo for differant side every time
  addChatNameAndPic(currentUserId: string, chats: Chat[]): Chat[] {
    chats.forEach((chat) => {
      const otherIndex = chat.userIds.indexOf(currentUserId) == 0 ? 1 : 0;
      const { displayName, photoURL } = chat.users[otherIndex];
      chat.chatName = displayName;
      chat.chatPic = photoURL;
    });
    return chats;
  }
}
