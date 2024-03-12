import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Category } from './category.schema';
import { CategoryService } from './category.service';
import { Product } from 'src/product/product.schema';
import { ProductService } from 'src/product/product.service';
import { Inject, forwardRef } from '@nestjs/common';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private categoryService: CategoryService,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  @Query(() => [Category])
  async categories() {
    return this.categoryService.findAll();
  }

  @ResolveField('products', () => [Product])
  async getProducts(@Parent() category: Category) {
    return this.productService.findAllByCategoryId(category._id.toString());
  }
}
