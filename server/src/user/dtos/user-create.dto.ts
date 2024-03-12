import {
  Contains,
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { UserRole } from '../../decorator/role.entity';

import { CustomEmailConstraint } from '../../../util/emailValidator';

export class UserCreateDto {
  @IsEmail()
  @IsNotEmpty()
  // @Validate(CustomEmailConstraint)
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

  @IsEnum(UserRole, { each: true })
  role: string;
}
