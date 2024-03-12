import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export class Option {
  @Field(() => ID, { nullable: true })
  _id?: string;

  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop()
  description: string;

  @Field()
  @Prop()
  image: string;

  @Field()
  @Prop()
  price: number;

  @Field()
  @Prop()
  wieght?: number;

  @Field()
  @Prop({
    required: false,
  })
  sku?: boolean;

  @Field()
  @Prop({
    required: false,
  })
  quantity?: number;

  @Field()
  @Prop({
    required: false,
  })
  inStock?: boolean;
}

@ObjectType()
@Schema({ timestamps: true })
export class Product {
  @Field(() => ID, { nullable: true })
  _id?: string;

  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop()
  description: string;

  @Field()
  @Prop()
  image: string;

  @Field()
  @Prop()
  price: number;

  @Field()
  @Prop()
  sku: number;

  @Field()
  @Prop({
    required: true,
    ref: 'Category',
    type: mongoose.Schema.Types.ObjectId,
  })
  category: mongoose.Schema.Types.ObjectId;

  @Field()
  @Prop()
  weight: number;

  @Field()
  @Prop({
    required: false,
  })
  quantity: number;

  @Field()
  @Prop({
    required: false,
  })
  inStock: boolean;

  @Field(() => [Option])
  @Prop({
    type: [Option],
    required: false,
  })
  options: Option[];

  @Field()
  @Prop({
    required: false,
    default: true,
  })
  show: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export type ProductDocument = Product & Document;

ProductSchema.pre<ProductDocument>('save', function (next) {
  let error: Error;
  if (!!this.quantity == true && !!this.inStock == true)
    error = new Error(
      'A product cannot have both "quantity" and "inStock" defined. Please choose one.',
    );

  for (let i = 0; i < this.options.length; i++) {
    if (
      !!this.options[i].quantity == true &&
      !!this.options[i].inStock == true
    ) {
      error = new Error(
        'A product cannot have both "quantity" and "inStock" defined. Please choose one.',
      );
      break;
    }
  }

  if (error) next(error);
  else next();
});
