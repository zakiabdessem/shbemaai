import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { ProductCreateDto } from './dtos/product-create.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
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
    return await this.productModel.find({ category: id }).exec();
  }
}
