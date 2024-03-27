import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@ObjectType('options')
export class Option {
  changed?: boolean;
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
    default: 0,
  })
  quantity?: number;

  @Field()
  @Prop({
    required: false,
    default: false,
  })
  inStock?: boolean;

  @Field()
  @Prop({
    required: false,
  })
  track?: boolean;
}

// TODO: SHOW IN BUSSINESS OR STORE BUTTON

@ObjectType('Product')
@Schema({
  timestamps: {
    createdAt: true,
  },
})
export class Product {
  @Field(() => ID, { nullable: true })
  _id?: string;

  @Field({ nullable: true })
  @Prop()
  name: string;

  @Field({ nullable: true })
  @Prop()
  description: string;

  @Field({ nullable: true })
  @Prop()
  image: string;

  @Field({ nullable: true })
  @Prop()
  price: number;

  @Field({ nullable: true })
  @Prop({ required: false })
  sku: string;

  @Field({ nullable: true })
  @Prop()
  weight: number;

  @Field({ nullable: true })
  @Prop({
    required: false,
  })
  quantity: number;

  @Field({ nullable: true })
  @Prop({
    required: false,
  })
  inStock: boolean;

  @Field({ nullable: true })
  @Prop({
    required: false,
  })
  track: boolean;

  @Field(() => [Option], { nullable: true })
  @Prop({
    type: [Option],
    required: false,
  })
  options: Option[];

  @Field({ nullable: true })
  @Prop({
    required: false,
    default: true,
  })
  show: boolean;

  @Field({ nullable: true })
  @Prop({
    required: false,
    default: false,
  })
  promote: boolean;

  @Field({ nullable: true })
  @Prop({
    required: false,
  })
  business: number;

  @Field({ nullable: true })
  @Prop({
    required: false,
  })
  unit: number;

  @Prop({
    required: false,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Category',
  })
  categories: (Types.ObjectId | string)[];

}

export const ProductSchema = SchemaFactory.createForClass(Product);

export type ProductDocument = Product & Document;

ProductSchema.pre<ProductDocument>('save', function (next) {
  let error: Error;
  if (!!this.quantity == true && !!this.inStock == true)
    error = new Error(
      'A product cannot have both "quantity" and "inStock" defined. Please choose one.',
    );

  // for (let i = 0; i < this.options.length; i++) {
  //   if (
  //     !!this.options[i].quantity == true &&
  //     !!this.options[i].inStock == true
  //   ) {
  //     error = new Error(
  //       'A product cannot have both "quantity" and "inStock" defined. Please choose one.',
  //     );
  //     break;
  //   }
  // }

  if (error) next(error);
  else next();
});
