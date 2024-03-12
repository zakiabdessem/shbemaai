import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dtos/product-create.dto';
import { Response } from 'express';
import { Category } from 'src/category/category.schema';
import { CategoryService } from 'src/category/category.service';

@Controller('product')
export class ProductController {
  constructor(
    private readonly prodcutService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @Post()
  async create(
    @Body() createProductDto: ProductCreateDto,
    @Res() res: Response,
  ) {
    try {
      const { _id }: Category =
        await this.categoryService.createProductCategory(
          {
            name: createProductDto.category as string,
          },
          product._id,
        );

      const product = await this.prodcutService.create({
        ...createProductDto,
        category: _id,
      });

      return res.status(HttpStatus.OK).json({ data: product });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const product = await this.prodcutService.findOne(id);
      return res.status(HttpStatus.OK).json({ data: product });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }
}
