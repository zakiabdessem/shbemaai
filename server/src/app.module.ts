import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { OrderController } from './order/order.controller';
import { OrderModule } from './order/order.module';
import { CouponModule } from './coupon/coupon.module';
import { CartModule } from './cart/cart.module';
import { ClientModule } from './client/client.module';
import { ChargilyModule } from './chargily/chargily.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { GQLRolesGuard } from './guard/gql-role.guard';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    forwardRef(() =>
      GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: process.env.NODE_ENV !== 'production',
        context: ({ req }) => ({ req }),
      }),
    ),
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
