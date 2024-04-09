import { Query, Resolver } from '@nestjs/graphql';
import { CouponService } from './coupon.service';
import { Coupon } from './coupon.schema';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/decorator/role.entity';

@Resolver(() => Coupon)
export class CouponResolver {
  constructor(private orderService: CouponService) {}

  @Roles(UserRole.ADMIN)
  @Query(() => [Coupon])
  async coupons(): Promise<Coupon[]> {
    return this.orderService.findAll();
  }
}
