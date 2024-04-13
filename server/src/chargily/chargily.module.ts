import { Module, forwardRef } from '@nestjs/common';
import { ChargilyService } from './charigly.service';
import { ProductModule } from 'src/product/product.module';
import { ConfigModule } from '@nestjs/config';
import { ChargilyController } from './chargily.controller';
import { OrderModule } from 'src/order/order.module';

@Module({
  providers: [ChargilyService],
  controllers: [ChargilyController],
  imports: [
    forwardRef(() => ProductModule),
    forwardRef(() => OrderModule),
    ConfigModule.forRoot(),
  ],
  exports: [ChargilyService],
})
export class ChargilyModule {}
