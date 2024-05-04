import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../decorator/role.entity';
import { Client } from 'src/client/client.schema';
import { Types } from 'mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID, { nullable: true })
  _id?: string;

  @Field(() => Client, { nullable: true })
  @Prop({
    required: false,
    type: Types.ObjectId,
    ref: 'Client',
  })
  client?: Types.ObjectId | Client;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Field()
  @Prop()
  firstName: string;

  @Field()
  @Prop()
  lastName: string;

  @Field()
  @Prop({ type: String, enum: UserRole })
  role: UserRole;

  @Field()
  @Prop({
    default: true,
  })
  pending: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
