import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { OrderStatus, PaymentType } from './order.entity';

@ObjectType('Cart')
export class Cart {
  @Field(() => ID, { nullable: true })
  _id?: string;

  @Field(
    () => [
      {
        product: Product,
        option: {
          name: String,
        },
        quantity: Number,
      },
    ],
    { nullable: true },
  )
  @Prop({
    required: false,
    type: {
      product: Types.ObjectId,
      option: {
        name: String,
      },
      quantity: Number,
    },
    ref: 'Product',
  })
  products: [
    {
      product: Types.ObjectId;
      option: {
        name: string;
      };
      quantity: Number;
    },
  ];

  @Field({ nullable: true })
  @Prop({
    required: false,
    type: Types.ObjectId,
  })
  coupon: Types.ObjectId; //ila mawch null becarefull it may get deleted from the db

  @Field({ nullable: true })
  @Prop({
    required: false,
    type: Number,
  })
  subTotal: Number;

  @Field({ nullable: true })
  @Prop({
    required: false,
    type: Number,
  })
  total: Number;
}

@ObjectType('Order')
@Schema({
  timestamps: {
    createdAt: true,
  },
})
export class Order {
  @Field(() => ID, { nullable: true })
  _id?: string;

  @Field({ nullable: true })
  @Prop()
  orderNumber: Number;

  @Field({ nullable: true })
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  })
  client: Types.ObjectId;

  @Field(() => Cart, { nullable: true })
  @Prop({
    required: false,
    type: Cart,
    ref: 'Cart',
  })
  cart: Cart;

  @Field({ nullable: true })
  @Prop({
    required: false,
    type: String,
    enum: OrderStatus,
  })
  status: String;

  @Field({ nullable: true })
  @Prop({
    required: false,
    type: PaymentType,
  })
  paymentType: String;
}
