import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Anounce, AnounceSchema } from './anounce.schema';

@Module({
  providers: [],
  controllers: [],
  imports: [
    MongooseModule.forFeature([{ name: Anounce.name, schema: AnounceSchema }]),
  ],
  exports: [],
})
export class AnounceModule {}
