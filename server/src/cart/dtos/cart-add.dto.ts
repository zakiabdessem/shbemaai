import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export interface Option {
  name: string;
  quantity: number;
}

export class CartAddDto {
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
