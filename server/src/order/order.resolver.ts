import { Query, Resolver } from '@nestjs/graphql';
import { Order } from './order.schema';
import { OrderService } from './order.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Query(() => [Order])
  async orders(): Promise<Order[]> {
    return this.orderService.findAll();
  }
}
