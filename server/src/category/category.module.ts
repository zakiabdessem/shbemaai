import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './category.schema';

@Module({
  providers: [CategoryService],
  controllers: [CategoryController],
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
