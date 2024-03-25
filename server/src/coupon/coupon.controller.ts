import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { Roles } from 'src/decorator/roles.decorator';
import { CouponCreateDto } from './dtos/coupon-create.dto';
import { UserRole } from 'src/decorator/role.entity';
import { Request, Response } from 'express';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('create')
  @Roles(UserRole.ADMIN)
  async create(@Body() createCouponDto: CouponCreateDto, @Res() res: Response) {
    try {
      await this.couponService.create(createCouponDto);

      return res.status(HttpStatus.CREATED).json({
        message: 'Coupon created successfully',
      });
    } catch (error) {
      Logger.error(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get('count')
  async countDocument() {
    return await this.couponService.countDocument();
  }

}
