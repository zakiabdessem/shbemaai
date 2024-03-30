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

  @Query(() => Product)
  async product(@Args('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  //GET_DATA_PRODUCTS_BY_CATEGORY
  @Query(() => [Product])
  async productsByCategory(
    @Args('categoryId') categoryId: string,
    @Args('sortBy') sortBy: string,
    @Args('page') page: string,
  ): Promise<Product[]> {
    console.log(page);
    return await this.productService.findAllByCategoryId(categoryId, sortBy);
  }

  @Query(() => [Product])
  async products(
    @Args('sortBy') sortBy: string,
    @Args('page') page: string,
  ): Promise<Product[]> {
    return this.productService.findAll(sortBy, parseInt(page));
  }

  @Query(() => [Product])
  async relevantProducts(
  ): Promise<Product[]> {
    return this.productService.findRelevant();
  }

  @ResolveField('categories', () => [Category])
  async getCategory(@Parent() product: Product) {
    return this.categoryService.findAllById(product.categories);
  }
}
