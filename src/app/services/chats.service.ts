import { Injectable } from '@angular/core';
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  doc,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { ProfileUser } from '../models/user';
import { Observable, concatMap, map, take, tap } from 'rxjs';
import { UserService } from './user.service';
import { Chat, Message } from '../models/chat';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor(
    private fireStrore: Firestore,
    private userService: UserService
  ) {}

  // fire ***********************************************start create new chat ***********************************************
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
      //  green return the id for the new chat
      map((ref) => ref.id)
    );
  }
  // fire ***********************************************end create new chat ***********************************************

  // fire ***********************************************start get chats ***********************************************

  get myChats$(): Observable<Chat[]> {
    const ref = collection(this.fireStrore, 'chats');
    return this.userService.currentUserProfile$.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('userIds', 'array-contains', user?.uid)
        );
        // green here i add the id field for the chat
        return collectionData(myQuery, { idField: 'id' }).pipe(
          // green the chat name and pic will be just on local
          map((chats: Chat[]) => this.addChatNameAndPic(user?.uid ?? '', chats))
        ) as Observable<Chat[]>;
      })
    );
  }
  // fire ***********************************************end get chats ***********************************************

  // fire ***********************************************start add chat name and pic ***********************************************

  // pink now we will check every user to get the photo for the another user to display it in the chat list , we do that to get the name and the photo for differant side every time
  addChatNameAndPic(currentUserId: string, chats: Chat[]): Chat[] {
    chats.forEach((chat) => {
      const otherIndex = chat.userIds.indexOf(currentUserId) == 0 ? 1 : 0;
      const { displayName, photoURL } = chat.users[otherIndex];
      chat.chatName = displayName;
      chat.chatPic = photoURL;
    });
    return chats;
  }

  // fire ***********************************************end add chat name and pic ***********************************************

  // fire ***********************************************start add messages to chat ***********************************************

  addChatMessage(chatId: string, message: string): Observable<any> {
    const ref = collection(this.fireStrore, 'chats', chatId, 'messages');
    const chatRef = doc(this.fireStrore, 'chats', chatId);
    const today = Timestamp.fromDate(new Date());
    return this.userService.currentUserProfile$.pipe(
      take(1),

      concatMap((user) =>
        addDoc(ref, { text: message, senderId: user?.uid, sendDate: today })
      ),
      concatMap(() =>
        updateDoc(chatRef, { lastMessage: message, lastMessageDate: today })
      )
    );
  }

  // fire ***********************************************end  add messages to chat ***********************************************

  // fire ***********************************************start  get messages for chat ***********************************************

  getChatMessages$(chatId: string): Observable<Message[]> {
    const ref = collection(this.fireStrore, 'chats', chatId, 'messages');
    const queryAll = query(ref, orderBy('sendDate', 'asc'));
    return collectionData(queryAll) as Observable<Message[]>;
  }

  // fire ***********************************************end  get messages for chat ***********************************************

  // fire ***********************************************start  test if the chat is existing ***********************************************
  // green check if the chat is old
  isExistingChat(otherUserId: string): Observable<string | null> {
    return this.myChats$.pipe(
      take(1),
      tap((res) => console.log(res)),
      map((chats) => {
        for (let i = 0; i < chats.length; i++) {
          if (chats[i].userIds.includes(otherUserId)) {
            return chats[i].id;
          }
        }
        const chat = chats.find((c) => c.userIds.includes(otherUserId)) ?? null;
        return null;
      })
    );
  }
  // fire ***********************************************end  test if the chat is existing ***********************************************
}
