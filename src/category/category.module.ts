import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { categoryProviders } from './provider/category.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService,...categoryProviders],
  imports:[DatabaseModule]
})
export class CategoryModule {}
