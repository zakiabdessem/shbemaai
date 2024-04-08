import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, Order } from './order.schema';
import { Model } from 'mongoose';
import {
  OrderCreateDtoBussiness,
  OrderCreateDtoClient,
} from './dtos/create-order.dto';
import { Response } from 'express';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly clientService: ClientService,
  ) {}
  async createClient(
    orderCreateDto: OrderCreateDtoClient,
    cart: Cart,
  ): Promise<Order> {
    const newOrder = new this.orderModel({
      cart,
      client: await this.clientService.create(orderCreateDto.client),
      paymentType: orderCreateDto.paymentType,
      isStopDesk: orderCreateDto.isStopDesk,
    });
    return newOrder.save();
  }

  async createBussiness(
    OrderCreateDto: OrderCreateDtoBussiness,
  ): Promise<Order> {
    const newOrder = new this.orderModel(OrderCreateDto);
    return newOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return await this.orderModel
      .find()
      .populate('client')
      .populate({ path: 'cart.coupon', model: 'Coupon' })
      .lean()
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    return await this.orderModel.findById(id).populate('client').exec();
  }

  async pushCheckoutId(id: string, checkoutId): Promise<Order> {
    return await this.orderModel
      .findByIdAndUpdate(id, {
        checkoutId,
      })
      .exec();
  }

  async updateStatusById(id, stauts) {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { orderStatus: stauts })
      .exec();
    return order;
  }

  async updateStatusByCheckoutId(checkoutId, stauts) {
    const order = await this.orderModel
      .findOneAndUpdate({ checkoutId }, { orderStatus: stauts })
      .exec();
    return order;
  }

  async countDocument() {
    return this.orderModel.estimatedDocumentCount() || 0;
  }

  checkIfOrderExpired(createdAt: Date) {
    const expireDate = new Date(createdAt);
    expireDate.setDate(expireDate.getDate() + 1);
    return expireDate > new Date();
  }
}
