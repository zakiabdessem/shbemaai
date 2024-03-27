import { MiddlewareConsumer, Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { ClientModule } from 'src/client/client.module';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { ChargilyModule } from 'src/chargily/chargily.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ClientModule,
    ChargilyModule
  ],
  providers: [OrderResolver, OrderService],
  controllers: [OrderController],
})
export class OrderModule {
  constructor(private orderService: OrderService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude().forRoutes("order/business/create");
  }
}
