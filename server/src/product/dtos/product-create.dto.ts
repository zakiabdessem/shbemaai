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

export class ProductCreateDto {
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
  @IsNumber()
  buisness?: number;

  @IsOptional()
  @IsNumber()
  unit?: number;

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
