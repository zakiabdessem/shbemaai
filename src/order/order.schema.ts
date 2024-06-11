import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { OrderStatus, OrderType, PaymentType } from './order.entity';
import { Coupon } from 'src/coupon/coupon.schema';
import { APP_GUARD } from '@nestjs/core';
import { Client } from 'src/client/client.schema';

@ObjectType('Cart')
export class Cart {
  @Field(() => ID, { nullable: true })
  _id?: string;

  @Field(() => [Product], { nullable: true })
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
      options: [{ name: string; quantity: number }];
      quantity: Number;
    },
  ];

  @Field(() => Coupon, { nullable: true })
  @Prop({
    required: false,
    type: Types.ObjectId,
    ref: 'Coupon',
  })
  coupon: Types.ObjectId;

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
  discountedPrice: Number;

  @Field({ nullable: true })
  @Prop({
    required: false,
    type: Number,
  })
  discountPercentage: Number;

  @Field({ nullable: true })
  @Prop({
    required: false,
    type: Number,
  })
  totalPrice: Number;

  @Field({ nullable: true })
  @Prop({
    required: false,
    type: String,
  })
  note: String;
}

@ObjectType('Order')
@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
})
export class Order {
  @Field(() => ID, { nullable: true })
  _id?: string;

  @Field({ nullable: true })
  @Prop({
    required: false,
  })
  createdAt?: Date;

  @Field({ nullable: true })
  @Prop({
    required: false,
  })
  orderNumber?: Number;

  @Field(() => Client, { nullable: true })
  @Prop({
    required: false,
    type: Types.ObjectId,
    ref: 'Client',
  })
  client?: Types.ObjectId | Client;

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
    default: 'pending',
  })
  orderStatus: String;

  @Field({ nullable: true })
  @Prop({
    required: false,
    enum: PaymentType,
    type: String,
  })
  paymentType: PaymentType;

  @Field({ nullable: true })
  @Prop({
    required: false,
    type: String,
  })
  checkoutId?: string;

  @Field({ nullable: true })
  @Prop({
    required: false,
    default: 'client',
    enum: OrderType,
    type: String,
  })
  orderType: OrderType;

  @Field({ nullable: true })
  @Prop({
    required: false,
    type: Boolean,
  })
  isBussiness?: boolean;

  @Field({ nullable: true })
  @Prop({
    required: true,
    type: Boolean,
  })
  isStopDesk: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
