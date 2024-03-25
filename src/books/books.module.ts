import { Module } from '@nestjs/common';
import { BookService } from './books.service';
import { BookController } from './books.controller';
import { bookProviders } from './provider/book.providers'; 
import { DatabaseModule } from 'src/database/database.module';
import { categoryProviders } from 'src/category/provider/category.providers';

@Module({
  controllers: [BookController],
  providers: [BookService,...bookProviders,...categoryProviders],
  imports:[DatabaseModule]
})
export class BooksModule {}
