import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { UsersService } from './../users/users.service';
import { User } from './../users/interfaces/user.interface';
import { CreateUserDto } from './../users/dto/user.dto';
import { UserResponseDto } from 'src/users/dto/user.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signIn(username: string, pass: string) {
    try {
      const user = await this.usersService.findOne(username);
      if (!user) {
        throw new NotFoundException('Not found your username');
      }

      const isMath = await bcrypt.compare(pass, user.password);

      if (!isMath) {
        throw new UnauthorizedException('Password is incorrect');
      }

      let payload: any = {};
      payload = {
        sub: user.id,
        username: user.username,
      };
      const refresh_token = await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('EXPIRES_IN_REFRESH_TOKEN'),
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const access_token = await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('EXPIRES_IN_ACCESS_TOKEN'),
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      user.refreshToken = refresh_token;
      await user.save();

      return {
        access_token: access_token,
        refresh_token: refresh_token,
      };
    } catch (error) {
      throw error;
    }
  }

  async signUp(Body: CreateUserDto): Promise<UserResponseDto> {
    const usernameAlreadyExists = await this.usersService.findOne(
      Body.username,
    );
    if (usernameAlreadyExists) {
      throw new UnauthorizedException('username has been used');
    }
    const emailAlreadyExists = await this.usersService.findByEmail(Body.email);
    if (emailAlreadyExists) {
      throw new UnauthorizedException('email has been used');
    }
    const hashPassword = await bcrypt.hash(Body.password, 10);
    return this.usersService.createUser({
      ...Body,
      password: hashPassword,
    });
  }

  async logOut(username: string): Promise<User | undefined> {
    try {
      const fondUser = await this.usersService.findOne(username);
      if (!fondUser) {
        throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
      }
      fondUser.refreshToken = '';
      return await fondUser.save();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async refresh(refreshToken: string) {
    try {
      const foundUser = await this.usersService.findOneToken(refreshToken);
      if (!foundUser) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      try {
        const verifyToken = this.jwtService.verify(refreshToken, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        });
        if (verifyToken.username != foundUser.username) {
          throw new ForbiddenException();
        }
        const payload = {
          sub: foundUser.id,
          username: foundUser.username,
        };

        const access_token = await this.jwtService.signAsync(payload, {
          expiresIn: this.configService.get<string>('EXPIRES_IN_ACCESS_TOKEN'),
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        });
        return access_token;
      } catch (error) {
        throw new ForbiddenException();
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
