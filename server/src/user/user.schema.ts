import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from './user.entity';

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID, { nullable: true })
  _id?: string;

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
  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
