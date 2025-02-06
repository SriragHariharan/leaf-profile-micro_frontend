export interface User {
  userID: string;
  username: string;
  profilePicture: string;
  description: string;
  isFriend: boolean;
  friendStatus: string;
  FriendOf?: Object;
  Profile: Object;
}