import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { CategoryModule } from 'src/category/category.module';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guard/role.guard';
import { ProductResolver } from './product.resolver';

@Module({
  providers: [
    ProductService,
    ProductResolver,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [ProductController],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CategoryModule,
  ],
  exports: [ProductService],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude().forRoutes(ProductController);
  }
}
