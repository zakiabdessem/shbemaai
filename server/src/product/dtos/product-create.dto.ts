import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Option } from '../product.schema';
import mongoose, { Types } from 'mongoose';

export class Business {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  unit: number;
}

export class ProductCreateDto {
  _id: string;
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  business: Business[];

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  sku?: string;

  category?: mongoose.Schema.Types.ObjectId | string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  track?: boolean;

  @IsOptional()
  @IsArray()
  options?: Option[];

  @IsOptional()
  @IsBoolean()
  promote?: boolean;

  @IsOptional()
  @IsBoolean()
  show?: boolean;

  @IsOptional()
  @IsArray({
    message: 'Categories must be an array of ObjectId',
  })
  categories?: (Types.ObjectId | string)[];
}
