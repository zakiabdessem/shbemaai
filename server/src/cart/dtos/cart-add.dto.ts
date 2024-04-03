import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

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

export class CartDeleteDto {
  @IsNotEmpty()
  @IsString()
  product: string;

  @IsOptional()
  @IsString()
  option?: string;

  @IsOptional()
  @IsNumber()
  quantity: number;
}

export class CartAddCouponDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}

export class addCartNoteDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 516)
  note: string;
}
