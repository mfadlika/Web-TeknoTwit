export type Identifier = string | number | null;

export interface PostAuthor {
  id: Identifier;
  name: string;
}

export interface Post {
  id: string | number;
  author: PostAuthor;
  user?: unknown;
  userId?: Identifier;
  content: string;
  createdAt: string;
  likes: number;
}

export type FeedTab = "all" | "following";
