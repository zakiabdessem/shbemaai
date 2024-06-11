import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date } from 'mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class Coupon {
  @Field(() => ID, { nullable: true })
  _id?: string;

  @Field()
  @Prop({ required: true, unique: true })
  code: string;

  @Field()
  @Prop({ required: true })
  discount: number;

  @Field(() => Date)
  @Prop({ required: true, type: Date })
  expireDate: Date;

  @Field()
  @Prop({ required: true })
  isActive: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
