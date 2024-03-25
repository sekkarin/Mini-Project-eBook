import { Document } from 'mongoose';

export interface Book extends Document {
  category: string; // ใช้ชนิดของ ObjectId หรือ ref กับ Category จากโมดูล Category แทน string ในแบบที่ใช้จริง
  title: string;
  author: string;
  authorWebsite?: string;
  publisher: string;
  ISBN: string;
  coverImage?: string;
  bookFile?: string;
}
