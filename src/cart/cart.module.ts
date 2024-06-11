import { Module } from '@nestjs/common';
import { CouponService } from 'src/coupon/coupon.service';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CouponModule } from 'src/coupon/coupon.module';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [CouponModule, ProductModule],
})
export class CartModule {}
