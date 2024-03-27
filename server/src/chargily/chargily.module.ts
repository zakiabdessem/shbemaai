import { Module } from '@nestjs/common';
import { ChargilyService } from './charigly.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  providers: [ChargilyService],
  controllers: [],
  imports: [ProductModule],
  exports: [ChargilyService],
})
export class ChargilyModule {}
