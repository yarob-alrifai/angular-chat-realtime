import { ProfileUser } from './user';

export interface Chat {
  id: string;
  lastMessage?: string;
  lastMessageDate?: string;
  userIds: string[];
  users: ProfileUser[];

  chatPic?: string;
  chatName?: string;
}
export interface Message {
  text: string;
  senderId: string;
  sentDate: string;
}
