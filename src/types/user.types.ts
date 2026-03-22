

export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
}


export interface IUserDocument extends IUser {
  isModified(arg0: string): unknown;
  comparePassword(candidatePassword: string): Promise<boolean>;
}