import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryCreateDto {
  _id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
