import { Document } from 'mongoose';

export interface User extends Document {
  firstName: string;
  titleName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  profileUrl: string;
  refreshToken: string;
  phone: string;
}
