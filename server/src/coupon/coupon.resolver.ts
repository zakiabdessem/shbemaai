import { Query, Resolver } from '@nestjs/graphql';
import { CouponService } from './coupon.service';
import { Coupon } from './coupon.schema';

@Resolver(() => Coupon)
export class CouponResolver {
  constructor(private orderService: CouponService) {}

  @Query(() => [Coupon])
  async coupons(): Promise<Coupon[]> {
    return this.orderService.findAll();
  }
}
