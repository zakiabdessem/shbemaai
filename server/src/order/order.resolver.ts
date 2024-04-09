import { Args, Query, Resolver } from '@nestjs/graphql';
import { Order } from './order.schema';
import { OrderService } from './order.service';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/decorator/role.entity';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guard/role.guard';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { GqlAuthGuard } from 'src/guard/gql-auth.guard';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Query(() => [Order])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async orders(
    @Args('page') page: number,
    @Args('searchQuery') searchQuery: string,
  ): Promise<Order[]> {
    return this.orderService.findAll(page, searchQuery);
  }
}
