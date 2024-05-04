import { Args, Query, Resolver } from '@nestjs/graphql';
import { Order } from './order.schema';
import { OrderService } from './order.service';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/decorator/role.entity';
import { Req, Session, UseGuards } from '@nestjs/common';
import { GQLRolesGuard } from 'src/guard/gql-role.guard';
import { Request } from 'express';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Query(() => [Order])
  @Roles(UserRole.ADMIN)
  async orders(
    @Args('page') page: number,
    @Args('searchQuery') searchQuery: string,
  ): Promise<Order[]> {
    return this.orderService.findAll(page, searchQuery);
  }

  @Query(() => [Order])
  @Roles(
    UserRole.BUISNESS,
    UserRole.CLIENT,
    UserRole.ADMIN,
    UserRole.BUISNESS,
    UserRole.READ,
  )
  async ordersByClient(@Args('email') email: string) {
    return this.orderService.findByClient(email);
  }
}
