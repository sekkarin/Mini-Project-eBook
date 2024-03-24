import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'sub  , roles , username',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTJjYjliOTdkMDMxZGY5ODhiNDQ0OWQiLCJ1c2VybmFtZSI6InVzZXIxIiwicm9sZXMiOlsiQURNSU4iLCJVU0VSIl0sImlhdCI6MTY5NzYwNTQ1OCwiZXhwIjoxNjk4MTIzODU4fQ.hYwDpaFwBBrprOIy5q2aBvnsVyadQZXI8xXZJMpXKrw',
  })
  access_token: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @Length(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @ApiProperty({
    description: 'new password of the user',
    example: 'NewPassword123',
  })
  newPassword: string;
}
