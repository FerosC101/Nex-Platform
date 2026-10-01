export type PostType =
  | "DISCUSSION"
  | "QUESTION"
  | "PROJECT"
  | "COLLABORATION"
  | "OPPORTUNITY"
  | "ANNOUNCEMENT";

export interface StudentProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  schoolId: string;
  schoolName: string;
  course: string;
  yearLevel: string;
  bio: string;
  profileImage?: string;
  skills: string[];
  interests: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  createdAt: string;
}

export interface PostAuthor {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  school: string;
  course: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: PostAuthor;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  upvotes: number;
}

export interface Post {
  id: string;
  authorId: string;
  author: PostAuthor;
  title: string;
  content: string;
  postType: PostType;
  isAnonymous: boolean;
  upvotes: number;
  commentsCount: number;
  createdAt: string;
  tags: string[];
  comments?: Comment[];
}
