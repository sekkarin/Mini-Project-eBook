import { Request, Response } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as fs from 'fs';
import {
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { AuthGuard } from './../auth/guards/auth.guard';
import { UpdateUserDto } from './dto/user.dto';
import { MongoDBObjectIdPipe } from './../utils/pipes/mongodb-objectid.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageFiles } from './../utils/storageFiles';
import { ConfigService } from '@nestjs/config';

// TODO: sort and filter get users
@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Patch()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageFiles(),
      fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
          return callback(new BadRequestException('Invalid file type'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5000,
      },
    }),
  )
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const protocol = req.protocol;
    const host = req.hostname;
    const originUrl = req.originalUrl;
    const fullUrl =
      protocol +
      '://' +
      host +
      `:${this.configService.get<string>('PORT')}` +
      originUrl +
      '/profile/';

    try {
      // TODO: delete image old
      // TODO: Refactor code and clean up
      // TODO: SAVE image when error
      // FIXME: dto update
      // FIXME: fix full path

      const id = req['user'].sub;
      //  console.log(req?.fileValidationError);

      if (Object.keys(updateUserDto).length === 0 && !file) {
        throw new BadRequestException(
          'Please provide at least one field to update.',
        );
      }

      const updatedUser = this.usersService.update(
        updateUserDto,
        id,
        file,
        fullUrl,
      );
      return updatedUser;
    } catch (error) {
      if (file) {
        const filePath = file.path;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      throw error;
    }
  }
  @Delete()
  @UseGuards(AuthGuard)
  async deleteUser(@Req() req: Request) {
    try {
      const { sub } = req['user'];

      await this.usersService.deleteUser(sub);
      return {
        message: 'delete user successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(
    @Req() req: Request,
    @Param('id', MongoDBObjectIdPipe) id: string,
  ) {
    const { sub } = req['user'];
    try {
      if (id !== sub) {
        throw new ForbiddenException(
          'You are not authorized to access this resource',
        );
      }
      return await this.usersService.findOneById(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('profile/:filename')
  async getProfilePicture(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    res.sendFile(filename, {
      root: './uploads/profiles/',
    });
  }
}
