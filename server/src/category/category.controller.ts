import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Response } from 'express';
import { ProductService } from 'src/product/product.service';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
  ) {}

  @Post('delete')
  async delete(@Body() { id }: { id: string }, @Res() res: Response) {
    try {
      const category = await this.categoryService.findOne(id);

      if (!category)
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Category not found',
        });

      const productByCategory = await this.productService.findOneByCategoryId(
        category._id.toString(),
      );

      if (productByCategory)
        return res.status(HttpStatus.BAD_REQUEST).json({
          message:
            'Category cant be removed as it contains more than just products',
        });

      await this.categoryService.findOneAndDelete(id);
      return res.status(HttpStatus.ACCEPTED).json({
        message: 'Category Deleted successfully',
      });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Post('update')
  async update(
    @Body() { id, name }: { id: string; name: string },
    @Res() res: Response,
  ) {
    try {
      const category: any = await this.categoryService.findOne(id);

      if (!category) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Category not found',
        });
      }

      await this.categoryService.update(id, name);

      return res.status(HttpStatus.ACCEPTED).json({
        message: 'Category updated successfully',
      });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
