import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class BodyUserLoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  password: string;
}
export class AccessTokenResponseDto {
  access_token: string;
}

export class ResetPasswordDto {
  newPassword: string;
}
