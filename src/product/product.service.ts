import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import mongoose, { Model, Types } from 'mongoose';
import { ProductCreateDto } from './dtos/product-create.dto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(CategoryCreateDto: ProductCreateDto): Promise<Product> {
    const newProduct = new this.productModel(CategoryCreateDto);

    await Promise.all(
      CategoryCreateDto.categories.map(async (category) => {
        await this.categoryService.PushProduct(category, newProduct._id);
      }),
    );

    return await newProduct.save();
  }

  async edit(
    CategoryCreateDto: ProductCreateDto,
  ): Promise<Product & { _id: string }> {
    const product = await this.findOne(CategoryCreateDto['_id']);
    if (!product) return null as any;

    return await (
      this.productModel.findByIdAndUpdate(
        CategoryCreateDto['_id'],
        CategoryCreateDto,
        {
          new: true,
        },
      ) as any
    ).exec();
  }

  async findAll(
    sortBy: string,
    page: number,
    searchQuery: string,
  ): Promise<Product[]> {
    const Limit = 15;
    const Skip = (page - 1) * Limit;

    if (searchQuery) {
      const queryConditions: any = {};

      const regex = new RegExp(searchQuery, 'i');
      queryConditions.$or = [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
      ];

      return await this.productModel
        .find(queryConditions)
        .limit(Limit)
        .skip(Skip)
        .sort({ createdAt: -1 })
        .exec();
    }

    if (!sortBy)
      return await this.productModel.find().limit(Limit).skip(Skip).exec();
    if (sortBy == 'stock')
      return await this.productModel
        .find({
          $or: [{ inStock: true }, { quantity: { $exists: true, $ne: 0 } }],
        })
        .sort({ inStock: -1, quantity: -1 })
        .limit(Limit)
        .skip(Skip)
        .exec();

    if (sortBy == 'date')
      return await this.productModel
        .find({
          $or: [{ inStock: true }, { quantity: { $exists: true, $ne: 0 } }],
        })
        .sort({ inStock: -1, quantity: -1, createdAt: -1 })
        .limit(Limit)
        .skip(Skip)
        .exec();

    //sort by createdAt
    return await this.productModel
      .find()
      .limit(Limit)
      .skip(Skip)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findRelevant() {
    return await this.productModel
      .find({
        $or: [
          { track: true, quantity: { $gt: 0 }, promote: false },
          { track: false, inStock: true, promote: false },
        ],
      })
      .limit(8)
      .sort({
        createdAt: 1,
      })
      .exec();
  }

  async findNewer() {
    return await this.productModel
      .find({
        $or: [
          { track: true, quantity: { $gt: 0 }, promote: true },
          { track: false, inStock: true, promote: true },
        ],
      })
      .limit(4)
      .sort({
        createdAt: 1,
      })
      .exec();
  }

  async findOne(id: string | Types.ObjectId): Promise<Product> {
    return await this.productModel.findById(id);
  }

  async findAllByCategoryId(
    categoryId: string,
    sortBy: string,
    page: number,
    searchQuery: string,
  ): Promise<Product[]> {
    const Limit = 15;
    const Skip = (page - 1) * Limit;
    // Check if valid mongoID
    if (!mongoose.Types.ObjectId.isValid(categoryId)) return [];

    if (searchQuery) {
      const queryConditions: any = {};

      const regex = new RegExp(searchQuery, 'i');
      queryConditions.$or = [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
      ];

      if (categoryId) {
        queryConditions.$and = queryConditions.$and || [];
        queryConditions.$and.push({ categories: categoryId });
      }

      return await this.productModel
        .find(queryConditions)
        .limit(Limit)
        .skip(Skip)
        .sort({ createdAt: -1 })
        .exec();
    }

    const query = { categories: categoryId };
    let sortQuery = {};

    // Define sort options
    if (sortBy === 'stock') {
      query['$or'] = [
        { inStock: true },
        { quantity: { $exists: true, $ne: 0 } },
      ];
      sortQuery = { inStock: -1, quantity: -1 };
    } else {
      sortQuery = { createdAt: -1 };
    }

    // Execute query
    return await this.productModel
      .find(query)
      .sort(sortQuery)
      .limit(Limit)
      .skip(Skip)
      .exec();
  }

  async findAllByCategoriesId(
    categoryId: string,
    sortBy: string,
    page: number,
    searchQuery: string,
  ): Promise<Product[]> {
    const Limit = 15;
    const Skip = (page - 1) * Limit;

    let query =
      categoryId !== 'all'
        ? { categories: { $in: categoryId.split(',') } }
        : {};
    let sortQuery = {};

    if (searchQuery) {
      const queryConditions: any = {};

      const regex = new RegExp(searchQuery, 'i');
      queryConditions.$or = [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
      ];

      return await this.productModel
        .find(queryConditions)
        .sort({ createdAt: -1 })
        .limit(Limit)
        .skip(Skip)
        .exec();
    }

    // Define sort options
    if (sortBy === 'stock') {
      query['$or'] = [
        { inStock: true },
        { quantity: { $exists: true, $ne: 0 } },
      ];
      sortQuery = { inStock: -1, quantity: -1 };
    } else {
      sortQuery = { createdAt: -1 };
    }

    // Execute query
    return await this.productModel
      .find(query)
      .sort(sortQuery)
      .limit(Limit)
      .skip(Skip)
      .exec();
  }

  async findOneByCategoryId(id: string) {
    return await this.productModel.findOne({
      categories: id,
    });
  }

  async delete(id: string) {
    return await this.productModel.findByIdAndDelete(id);
  }

  async countDocument(selectedCategoryId: string, sortBy: string) {
    if (selectedCategoryId) {
      const category = await this.categoryService.findOne(selectedCategoryId);
      if (!category) return 0;
      return category.products.length;
    } else return this.productModel.estimatedDocumentCount() || 0;
  }
}
