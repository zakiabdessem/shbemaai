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
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/decorator/role.entity';

@Controller('product')
export class ProductController {
  constructor(
    private readonly prodcutService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @Post('create')
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createProductDto: ProductCreateDto,
    @Res() res: Response,
  ) {
    try {
      const { _id }: Category =
        await this.categoryService.createProductCategory({
          name: createProductDto.category as string,
        });

      const product = await this.prodcutService.create({
        ...createProductDto,
        category: _id,
      });

      await this.categoryService.PushProduct(_id, product._id);

      return res.status(HttpStatus.OK).json({ data: product });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  @Post('count')
  async countDocument(@Body('selectedCategoryId') selectedCategoryId: string) {
    return await this.prodcutService.countDocument(selectedCategoryId, '');
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
