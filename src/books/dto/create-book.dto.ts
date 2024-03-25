import { IsString, IsOptional } from 'class-validator';

export class CreateBookDto {
  @IsString()
  category: string; // ใช้ชนิดของ ObjectId หรือ ref กับ Category จากโมดูล Category แทน string ในแบบที่ใช้จริง

  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  @IsOptional()
  authorWebsite?: string;

  @IsString()
  publisher: string;

  @IsString()
  ISBN: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  bookFile?: string;
}
