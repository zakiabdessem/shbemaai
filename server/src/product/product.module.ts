import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { CategoryModule } from 'src/category/category.module';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CategoryModule,
  ],
})
export class ProductModule {}
