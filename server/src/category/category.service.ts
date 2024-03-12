import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Category } from './category.schema';
import { CategoryCreateDto } from './dtos/category_create.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async createProductCategory(
    createCategoryDto: CategoryCreateDto,
  ): Promise<Category> {
    const category = await this.categoryModel.findOne({
      name: createCategoryDto.name.toLowerCase(),
    });

    if (category) return category;

    const newCategory = new this.categoryModel({
      ...createCategoryDto,
      name: createCategoryDto.name.toLowerCase(),
    });

    return await newCategory.save();
  }

  async findAll(): Promise<Category[]> {
    const categorie: Category[] = await this.categoryModel.find().exec();

    return categorie;
  }

  async PushProduct(id: ObjectId, productId): Promise<Category> {
    return await this.categoryModel
      .findByIdAndUpdate(id, {
        $push: { products: productId },
      })
      .exec();
  }

  async findOne(id: string): Promise<Category> {
    return await this.categoryModel.findById(id).exec();
  }
}
