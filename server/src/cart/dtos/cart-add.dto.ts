import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CartAddDto {
  //TODO: validate Cart
  @IsNotEmpty()
  @IsString()
  product: string;

  @IsOptional()
  @IsString()
  option?: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
