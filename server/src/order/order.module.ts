import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderController } from './order.controller';

@Module({
  providers: [OrderResolver],
  controllers: [OrderController],
})
export class OrderModule {}
