import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType('Adress')
export class Adress {
  @Field({ nullable: true })
  @Prop({
    required: false,
  })
  address: string;

  @Field({ nullable: true })
  @Prop({
    required: false,
  })
  willaya: string;

  @Field({ nullable: true })
  @Prop({
    required: false,
  })
  commun: string;

  @Field({ nullable: true })
  @Prop()
  phone: string;
}

@ObjectType('Client')
@Schema()
export class Client {
  @Field(() => ID, { nullable: true })
  @Prop()
  firstName: string;

  @Field({ nullable: true })
  @Prop()
  lastName: string;

  @Field({ nullable: true })
  @Prop()
  email: string;

  @Field({ nullable: true })
  @Prop({
    required: false,
  })
  clientType: string;

  @Field(() => Adress, { nullable: true })
  @Prop({
    required: false,
    type: Adress,
  })
  address: Adress;

  @Field(() => String, { nullable: true })
  @Prop({
    required: false,
    type: String,
  })
  note: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
