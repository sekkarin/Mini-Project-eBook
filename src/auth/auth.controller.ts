import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { Roles } from './decorator/roles.decorator';
import { Role } from './enums/role.enum';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CreateUserDto } from './../users/dto/user.dto';
import {
  AccessTokenResponseDto,
  BodyUserLoginDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { UserResponseDto } from 'src/users/dto/user.response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, // private myLogger: MyLoggerService// private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async signIn(@Body() signInDto: BodyUserLoginDto, @Res() res: Response) {
   
    const user = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    const expiresInSeconds = this.configService.getOrThrow<number>(
      'EXPIRES_IN_COOKIES_REFRESH_TOKEN',
    );
    const maxAgeMilliseconds = expiresInSeconds * 24 * 60 * 60 * 1000;

    res.cookie('refresh_token', user.refresh_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true, 
      maxAge: maxAgeMilliseconds,
    });
    return res.status(200).json({ access_token: user.access_token });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signUp(@Body() signUpDto: CreateUserDto) {
    try {
      return this.authService.signUp(signUpDto);
    } catch (error) {
      console.log(error);
      
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logOut(@Req() req: Request, @Res() res: Response) {
    const username = req.user.username;
    await this.authService.logOut(username);
    res.clearCookie('refresh_token');
    res.status(200).json({ message: "logout's" });
  }

  @Get('refresh')
  async refresh(@Req() request: Request, @Res() res: Response) {
    const cookies = request.cookies;
    if (!cookies.refresh_token) {
      throw new UnauthorizedException();
    }
    const access_token = await this.authService.refresh(cookies.refresh_token);
    res.status(200).json({ access_token });
  }
}
