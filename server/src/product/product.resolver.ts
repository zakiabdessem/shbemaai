import { Query, Resolver, ResolveField, Parent, Args } from '@nestjs/graphql';
import { Product } from './product.schema';
import { ProductService } from './product.service';
import { Category } from 'src/category/category.schema';
import { CategoryService } from 'src/category/category.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
  ) {}

  //GET_DATA_PRODUCTS_BY_CATEGORY
  @Query(() => [Product])
  async productsByCategory(
    @Args('categoryId') categoryId: string,
  ): Promise<Product[]> {
    return await this.productService.findAllByCategoryId(categoryId);
  }

  @Query(() => [Product])
  async products() {
    return this.productService.findAll();
  }

  @ResolveField('category', () => Category)
  async getCategory(@Parent() product: Product) {
    return this.categoryService.findOne(product.category.toString());
  }
}
