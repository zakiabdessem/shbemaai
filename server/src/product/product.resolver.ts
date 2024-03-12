import { Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.schema';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => [Product])
  async products() {
    return this.productService.findAll();
  }
}
