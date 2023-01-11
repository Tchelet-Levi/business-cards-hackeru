export interface UserAPIRes {
  token: string;
  user: User;
}

export interface User {
  fullName: string;
  isBusinessAccount: boolean;
  email: string;
  avatar?: string;
}
