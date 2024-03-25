import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './coupon.schema';
import { Model } from 'mongoose';
import { CouponCreateDto } from './dtos/coupon-create.dto';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private coupontModel: Model<Coupon>) {}

  async create(createCouponDto: CouponCreateDto) {
    return this.coupontModel.create(createCouponDto);
  }
  async findAll() {
    return await this.coupontModel.find().lean().exec();
  }
  async findOne(id: string) {
    return await this.coupontModel.findOne({
      code: id,
    });
  }

  async findOneById(id: string) {
    return await this.coupontModel.findById(id);
  }

  async update() {
    return 'update coupon';
  }
  async remove() {
    return 'remove coupon';
  }

  async countDocument() {
    return this.coupontModel.estimatedDocumentCount() || 0;
  }
}
