import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dtos/product-create.dto';
import { Response } from 'express';
import { CategoryService } from 'src/category/category.service';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/decorator/role.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as _ from 'lodash';
import { OrderService } from 'src/order/order.service';

function isValidURL(url: string) {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(url);
}

@Controller('product')
export class ProductController {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly prodcutService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly orderService: OrderService,
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
      if (!isValidURL(createProductDto.image)) {
        const { url } = await this.cloudinaryService.uploadImage(
          createProductDto.image,
        );
        createProductDto.image = url;
      }

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
      console.error('errorrrr', error);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  @Post('edit')
  @Roles(UserRole.ADMIN)
  async edit(@Body() editProductDto: ProductCreateDto, @Res() res: Response) {
    try {
      if (editProductDto.categories.length === 0 && !editProductDto.category)
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Categories are required' });

      // Upload main product image
      if (
        editProductDto.image &&
        !editProductDto.image.includes('cloudinary') &&
        !isValidURL(editProductDto.image)
      ) {
        const { url } = await this.cloudinaryService.uploadImage(
          editProductDto.image,
        );
        editProductDto.image = url;
      }

      const product = await this.prodcutService.edit(editProductDto);

      // Handle category logic
      if (
        editProductDto.category &&
        !editProductDto.categories.includes(editProductDto.category.toString())
      ) {
        const newCategory = await this.categoryService.createProductCategory({
          name: editProductDto.category as string,
        });
        product.categories.push(newCategory._id.toString());
      }

      // Push product to categories
      await Promise.all(
        product.categories.map(async (category) => {
          await this.categoryService.PushProduct(category, product._id);
        }),
      );

      // Upload option images and update URLs
      await Promise.all(
        editProductDto.options.map(async (option, index) => {
          //option.image maybe empty object
          if (
            !_.isEmpty(option.image) &&
            option.image &&
            !option.image.includes('cloudinary') &&
            option.changed
          ) {
            const { url } = await this.cloudinaryService.uploadImage(
              option.image,
            );
            product.options[index].image = url;
          }

          if (option.image && !option.image.includes('cloudinary')) {
            const { url } = await this.cloudinaryService.uploadImage(
              option.image,
            );
            product.options[index].image = url;
          }
        }),
      );

      await this.prodcutService.edit(product);

      return res.status(HttpStatus.OK).json({ data: product });
    } catch (error) {
      Logger.error(error);
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
      Logger.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  @Post('delete')
  async delete(@Body() { id }: { id: string }, @Res() res: Response) {
    try {
      const product = await this.prodcutService.findOne(id);

      if (!product)
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'No product found',
        });

      const order = await this.orderService.findOneWithProduct(id);

      if (order) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Orders found containing the specified product.',
        });
      }

      await this.prodcutService.delete(id);

      return res.status(HttpStatus.OK).json({ message: 'Success' });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
