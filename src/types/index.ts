export interface Post {
  id: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  image?: string;
}

export interface TravelDestination {
  id: string;
  country: string;
  place: string;
  year: number;
  visited: boolean;
}

export interface PhotoGallery {
  id: string;
  name: string;
  photos: string[];
}