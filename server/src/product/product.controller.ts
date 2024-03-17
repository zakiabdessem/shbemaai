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
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as _ from 'lodash';

@Controller('product')
export class ProductController {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly prodcutService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('create')
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createProductDto: ProductCreateDto,
    @Res() res: Response,
  ) {
    try {
      if (
        createProductDto.categories.length === 0 &&
        !createProductDto.category
      )
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Categories are required' });

      // Upload main product image
      const { url } = await this.cloudinaryService.uploadImage(
        createProductDto.image,
      );
      createProductDto.image = url;

      const newProduct = new this.productModel(createProductDto);

      // Handle category logic
      if (
        createProductDto.category &&
        !createProductDto.categories.includes(
          createProductDto.category.toString(),
        )
      ) {
        const newCategory = await this.categoryService.createProductCategory({
          name: createProductDto.category as string,
        });
        newProduct.categories.push(newCategory._id.toString());
      }

      // Push product to categories
      await Promise.all(
        newProduct.categories.map(async (category) => {
          await this.categoryService.PushProduct(category, newProduct._id);
        }),
      );

      // Upload option images and update URLs
      await Promise.all(
        createProductDto.options.map(async (option, index) => {
          //option.image maybe empty object
          if (!_.isEmpty(option.image) && option.image) {
            const { url } = await this.cloudinaryService.uploadImage(
              option.image,
            );
            newProduct.options[index].image = url;
          }
        }),
      );

      await newProduct.save();

      return res.status(HttpStatus.OK).json({ data: newProduct });
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
