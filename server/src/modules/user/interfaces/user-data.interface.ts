export interface UserData {
  userId: number;
  type: UserType;
}

export type UserType = 'admin' | 'user';
