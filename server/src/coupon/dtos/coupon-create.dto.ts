import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CouponCreateDto {
  _id: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @IsNotEmpty()
  @IsDateString()
  expireDate: Date;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
