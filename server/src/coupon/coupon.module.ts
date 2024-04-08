import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from './coupon.schema';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guard/role.guard';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { CouponResolver } from './coupon.resolver';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
  ],
  controllers: [CouponController],
  providers: [
    CouponService,
    { 
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    CouponResolver,
  ],
  exports: [CouponService],
})
export class CouponModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude().forRoutes(CouponController);
  }
}
