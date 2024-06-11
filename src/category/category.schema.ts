import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from 'src/product/product.schema';

@ObjectType('Category')
@Schema({
  timestamps: true,
})
export class Category {
  @Field(() => ID, { nullable: true })
  _id?: mongoose.Schema.Types.ObjectId;

  @Field({ nullable: true })
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Field((type) => [Product])
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
  products: Product[];

  @Field({ nullable: true })
  @Prop({
    required: false,
  })
  createdAt?: Date;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
