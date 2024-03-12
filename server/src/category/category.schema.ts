import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from 'src/product/product.schema';

@Schema()
export class Category {
  _id?: mongoose.Schema.Types.ObjectId;

  @Prop()
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    ref: 'Product',
    default: [],
  })
  products: Product[];
}
export const CategorySchema = SchemaFactory.createForClass(Category);
