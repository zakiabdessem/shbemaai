import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@ObjectType('Anounce')
@Schema({
  timestamps: true,
})
export class Anounce {
  @Field(() => ID, { nullable: true })
  _id?: mongoose.Schema.Types.ObjectId;

  @Field({ nullable: true })
  @Prop({
    required: true,
    unique: true,
  })
  image: string;

  @Field({ nullable: true })
  @Prop({
    required: true,
  })
  show: boolean;

  @Field({ nullable: true })
  @Prop({
    required: false,
  })
  createdAt?: Date;
}
export const AnounceSchema = SchemaFactory.createForClass(Anounce);
