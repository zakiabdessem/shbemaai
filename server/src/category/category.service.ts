import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Category } from './category.schema';
import { CategoryCreateDto } from './dtos/category_create.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async createProductCategory(
    createCategoryDto: CategoryCreateDto,
    product: string,
  ): Promise<Category> {
    const category = await this.categoryModel.findOneAndUpdate(
      {
        name: createCategoryDto.name.toLowerCase(),
      },
      {
        $push: { products: createCategoryDto.products },
      },
    );

    if (category) return category;

    const newCategory = new this.categoryModel({
      ...createCategoryDto,
      name: createCategoryDto.name.toLowerCase(),
      products: [...createCategoryDto.products].push(product as any),
    });

    return await newCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryModel
      .find()
      .populate({
        path: 'products',
      })
      .exec();
  }
}
