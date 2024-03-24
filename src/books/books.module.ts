import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { bookProviders } from './provider/book.providers'; 
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [BooksController],
  providers: [BooksService,...bookProviders],
  imports:[DatabaseModule]
})
export class BooksModule {}
