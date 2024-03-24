import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { FileUploadDto } from './file-upload.dto';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  titleName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  titleName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  profile?: FileUploadDto;
}

export class User {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '1234567890',
  })
  readonly id?: string;
  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
  })
  readonly email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
  })
  readonly password: string;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  readonly name: string;

  @ApiProperty({
    description: 'Role of the user (User or Admin)',
    example: 'User',
    enum: ['User', 'Admin'],
  })
  readonly role?: {
    User: string;
    Admin: string;
  };

  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  })
  readonly username: string;

  @ApiProperty({
    description: 'Flag indicating whether the user is alive or not',
    example: 'true',
  })
  readonly isAlive: string;

  @ApiProperty({
    description: "URL for the user's profile picture",
    example: 'https://example.com/profile.jpg',
  })
  readonly profileUrl: string;
}
export class GetUserAllDto {
  @ApiProperty({
    description: 'Role of the user',
    example: { User: 'USER' },
  })
  role: {
    User: string;
  };

  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '652f749b1e4adf0bc1e322bf',
  })
  _id: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'Flag indicating whether the user is alive or not',
    example: true,
  })
  isAlive: boolean;

  @ApiProperty({
    description: "URL for the user's profile picture",
    example: 'https://example.com/profile.jpg',
  })
  profileUrl: string;

  @ApiProperty({
    description: 'Date and time of user creation',
    example: '2023-10-18T06:00:59.881Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date and time of last update',
    example: '2023-10-18T06:00:59.881Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Version of the document',
    example: 0,
  })
  __v: number;
}
