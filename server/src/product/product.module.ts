import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { CategoryModule } from 'src/category/category.module';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { APP_GUARD } from '@nestjs/core';
import { ProductResolver } from './product.resolver';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  providers: [ProductService, ProductResolver],
  controllers: [ProductController],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CategoryModule,
    CloudinaryModule,
    forwardRef(() => OrderModule),
  ],
  exports: [ProductService],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude().forRoutes(ProductController);
  }
}
