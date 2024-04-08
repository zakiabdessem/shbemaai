import { MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { ClientModule } from 'src/client/client.module';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { ChargilyModule } from 'src/chargily/chargily.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ClientModule,
    forwardRef(() => ChargilyModule),
    ProductModule,
  ],
  providers: [OrderResolver, OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude()
      .forRoutes('order/business/create', 'order/single', 'order/update');
  }
}
