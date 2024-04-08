import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { GraphqlModule } from './graphql/graphql.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { OrderController } from './order/order.controller';
import { OrderModule } from './order/order.module';
import { CouponModule } from './coupon/coupon.module';
import { CartModule } from './cart/cart.module';
import { ClientModule } from './client/client.module';
import { ChargilyModule } from './chargily/chargily.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    GraphqlModule,
    UserModule,
    ProductModule,
    CategoryModule,
    CloudinaryModule,
    OrderModule,
    CouponModule,
    CartModule,
    ClientModule,
    ChargilyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
