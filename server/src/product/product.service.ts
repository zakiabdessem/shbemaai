import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import mongoose, { Model } from 'mongoose';
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

    return await newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return await this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    return await this.productModel.findById(id);
  }

  async findAllByCategoryId(id: string): Promise<Product[]> {
    //check if valid mongoID
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) return [];

    return await this.productModel.find({ category: id }).exec();
  }

  async countDocument(selectedCategoryId: string) {
    if (selectedCategoryId) {
      const category = await this.categoryService.findOne(selectedCategoryId);
      if (!category) return 0;
      return category.products.length;
    } else return this.productModel.estimatedDocumentCount() || 0;
  }
}
