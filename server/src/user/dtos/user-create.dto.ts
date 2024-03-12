import {
  Contains,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { UserRole } from '../user.entity';

import { CustomEmailConstraint } from '../../../util/emailValidator';

export class UserCreateDto {
  @IsEmail()
  @IsNotEmpty()
  @Validate(CustomEmailConstraint)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: string;
}
