import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { GraphqlModule } from './graphql/graphql.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    GraphqlModule,
    UserModule,
    ProductModule,
    CategoryModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
