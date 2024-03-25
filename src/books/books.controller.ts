import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Req,
  Res,
} from '@nestjs/common';
import { BookService } from './books.service';
import { Book } from './interfaces/book.interface';
import { QueryparamsDto } from './dto/query-Params.Dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import * as fs from 'fs';
import { storageFiles } from 'src/utils/storageFiles';
import { CreateBookDto } from './dto/create-book.dto';
import { storageEbookFiles } from 'src/utils/storageeBookFile';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { MongoDBObjectIdPipe } from 'src/utils/pipes/mongodb-objectid.pipe';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async findAll(@Query() queryparamsDto: QueryparamsDto) {
    return this.bookService.findAll(queryparamsDto);
  }

  @Get(':id')
  async findOne(@Param('id', MongoDBObjectIdPipe) id: string): Promise<Book> {
    return this.bookService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'coverImage', maxCount: 1 },
        { name: 'bookFile', maxCount: 1 },
      ],
      {
        storage: storageEbookFiles(),
        fileFilter(req, file, callback) {
          if (
            file.fieldname === 'coverImage' &&
            !file.originalname.match(/\.(jpg|jpeg|png)$/)
          ) {
            return callback(
              new BadRequestException('Invalid cover image file type'),
              false,
            );
          } else if (
            file.fieldname === 'bookFile' &&
            !file.originalname.match(/\.(pdf)$/)
          ) {
            return callback(
              new BadRequestException('Invalid book file type'),
              false,
            );
          }
          callback(null, true);
        },
        limits: {
          fileSize: 1048576 * 5, // bytes to mb
        },
      },
    ),
  )
  async create(
    @Body() book: CreateBookDto,
    @Req() req: Request,
    @UploadedFiles()
    files: {
      coverImage?: Express.Multer.File[];
      bookFile?: Express.Multer.File[];
    },
  ) {
    const protocol = req.protocol;
    const host = req.hostname;
    const originUrl = req.originalUrl;
    const fullUrl =
      protocol +
      '://' +
      host +
      `:${this.configService.get<string>('PORT')}` +
      originUrl;
    try {
      return this.bookService.create(book, files, fullUrl);
    } catch (error) {
      if (files) {
        const coverImageFilePath = files.coverImage[0].path;
        const bookFilePath = files.coverImage[0].path;
        if (fs.existsSync(coverImageFilePath)) {
          fs.unlinkSync(coverImageFilePath);
        }
        if (fs.existsSync(bookFilePath)) {
          fs.unlinkSync(bookFilePath);
        }
      }
      throw error;
    }
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'coverImage', maxCount: 1 },
        { name: 'bookFile', maxCount: 1 },
      ],
      {
        storage: storageEbookFiles(),
        fileFilter(req, file, callback) {
          if (
            file.fieldname === 'coverImage' &&
            !file.originalname.match(/\.(jpg|jpeg|png)$/)
          ) {
            return callback(
              new BadRequestException('Invalid cover image file type'),
              false,
            );
          } else if (
            file.fieldname === 'bookFile' &&
            !file.originalname.match(/\.(pdf)$/)
          ) {
            return callback(
              new BadRequestException('Invalid book file type'),
              false,
            );
          }
          callback(null, true);
        },
        limits: {
          fileSize: 1048576 * 5, // bytes to mb
        },
      },
    ),
  )
  async update(
    @Body() book: UpdateBookDto,
    @Req() req: Request,
    @Param('id', MongoDBObjectIdPipe) id: string,
    @UploadedFiles()
    files: {
      coverImage?: Express.Multer.File[];
      bookFile?: Express.Multer.File[];
    },
  ) {
    const protocol = req.protocol;
    const host = req.hostname;
    const originUrl = req.originalUrl;
    const fullUrl =
      protocol +
      '://' +
      host +
      `:${this.configService.get<string>('PORT')}` +
      originUrl.split('/books/')[0];
    try {
      return this.bookService.update(id, files, book, fullUrl);
    } catch (error) {
      if (files) {
        const coverImageFilePath = files.coverImage[0].path;
        const bookFilePath = files.coverImage[0].path;
        if (fs.existsSync(coverImageFilePath)) {
          fs.unlinkSync(coverImageFilePath);
        }
        if (fs.existsSync(bookFilePath)) {
          fs.unlinkSync(bookFilePath);
        }
      }
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id', MongoDBObjectIdPipe) id: string): Promise<void> {
    return this.bookService.remove(id);
  }
  @Get('cover/:filename')
  async getCoverImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    res.sendFile(filename, {
      root: './uploads/ebook/',
    });
  }
  @Get('file/:filename')
  async getFileEbook(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    res.sendFile(filename, {
      root: './uploads/ebook/',
    });
  }
}
