export type SearchType = 'post' | 'user';

export type ViewMode = 'search' | 'saved';

export interface SearchUserResult {
  userID: string;
  username: string;
  profilepic: string | null;
}

export interface SearchPostUser {
  userID: string;
  username: string;
  profilepic?: string | null;
}

export interface SearchPostResult {
  id: string;
  content: string;
  imageURL?: string | null;
  createdAt: string;
  userID?: string;
  user?: SearchPostUser | null;
}

export interface SavedPostResult {
  postID: string;
  userID: string;
  user?: {
    username: string;
    profilepic?: string | null;
  };
  post?: {
    content: string;
    imageURL: string | null;
    createdAt: string | Date;
  };
}
