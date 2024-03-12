import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CategoryCreateDto {
  _id?: string;

  products?: mongoose.Schema.Types.ObjectId[];

  @IsString()
  @IsNotEmpty()
  name: string;
}
