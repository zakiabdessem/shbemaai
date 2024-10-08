import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
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

  async findAllById(categories): Promise<Category[]> {
    return await this.categoryModel.find({ _id: { $in: categories } }).exec();
  }

  async findOneAndDelete(id: string) {
    return await this.categoryModel.findByIdAndDelete(id);
  }

  async PushProduct(
    id: Types.ObjectId | string,
    productId: Types.ObjectId | string,
  ): Promise<Category> {
    return await this.categoryModel
      .findByIdAndUpdate(id, {
        $push: { products: productId },
      })
      .exec();
  }

  async PullProduct(
    id: Types.ObjectId | string,
    productId: Types.ObjectId | string,
  ): Promise<Category> {
    return await this.categoryModel
      .findByIdAndUpdate(id, {
        $pull: { products: productId },
      })
      .exec();
  }

  async findOne(id: string): Promise<Category> {
    return await this.categoryModel.findById(id).exec();
  }

  async update(id: string, name: string) {
    return await this.categoryModel.updateOne(
      {
        _id: id.toString(),
      },
      {
        name,
      },
    );
  }
}
