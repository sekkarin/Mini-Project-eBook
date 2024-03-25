import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Document, Model, Types } from 'mongoose';
import * as fs from 'fs';
import { Book } from './interfaces/book.interface';
import { QueryparamsDto } from './dto/query-Params.Dto';
import { CreateBookDto } from './dto/create-book.dto';
import { Category } from 'src/category/interfaces/category.interface';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @Inject('BOOK_MODEL')
    private bookModel: Model<Book>,
    @Inject('CATEGORY_MODEL')
    private categoryModel: Model<Category>,
  ) {}

  async findAll({ category, query }: QueryparamsDto) {
    let categoryQuery: Document | null;

    if (category) {
      const isValidObjectId = Types.ObjectId.isValid(category);
      if (!isValidObjectId) {
        throw new BadRequestException('Invalid ObjectId format');
      }
      categoryQuery = await this.categoryModel
        .findOne({ _id: category })
        .exec();
    }

    const devicesQuery = await this.bookModel.find({
      $or: [
        { title: { $regex: query || '', $options: 'i' } },
        { author: { $regex: query || '', $options: 'i' } },
        { category: categoryQuery?._id },
      ],
    });
    return devicesQuery;
  }

  async findOne(id: string): Promise<Book> {
    return this.bookModel.findById(id).exec();
  }

  async create(
    book: CreateBookDto,
    files: {
      coverImage?: Express.Multer.File[];
      bookFile?: Express.Multer.File[];
    },
    url: string,
  ) {
    let coverImageUrl: string | undefined = undefined;
    let bookFileUrl: string | undefined = undefined;

    coverImageUrl = url + 'cover/' + files.coverImage[0].filename;
    bookFileUrl = url + 'file/' + files.bookFile[0].filename;
    try {
      const createdBook = new this.bookModel({
        ...book,
        coverImage: coverImageUrl,
        bookFile: bookFileUrl,
      });
      return await createdBook.save();
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    files: {
      coverImage?: Express.Multer.File[];
      bookFile?: Express.Multer.File[];
    },
    book: UpdateBookDto,
    url: string,
  ) {
    let coverImageUrl: string | undefined = undefined;
    let bookFileUrl: string | undefined = undefined;
    const bookExisting = await this.bookModel.findById(id);
    if (!bookExisting) {
      throw new NotFoundException('not found ebook');
    }
    if (files.coverImage[0].filename) {
      coverImageUrl = url + '/books/cover/' + files.coverImage[0].filename;
      if (bookExisting?.coverImage) {
        const fullUrl = bookExisting?.coverImage.split('/cover/')[1];
        this.deleteFile('./uploads/ebook/' + fullUrl);
      }
    }
    if (files.bookFile[0].filename) {
      bookFileUrl = url + '/books/file/' + files.bookFile[0].filename;
      if (bookExisting?.bookFile) {
        const fullUrl = bookExisting?.bookFile.split('/file/')[1];
        this.deleteFile('./uploads/ebook/' + fullUrl);
      }
    }

    return this.bookModel
      .findByIdAndUpdate(
        id,
        {
          ...book,
          coverImage: coverImageUrl,
          bookFile: bookFileUrl,
        },
        { new: true },
      )
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.bookModel.findByIdAndRemove(id).exec();
  }
  private deleteFile(path: string) {
    const filePath = path;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
