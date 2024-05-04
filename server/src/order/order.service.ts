import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, Order } from './order.schema';
import { Model } from 'mongoose';
import {
  OrderCreateDtoBussiness,
  OrderCreateDtoClient,
} from './dtos/create-order.dto';
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

  async findAll(page: number, searchQuery: string): Promise<Order[]> {
    const Limit = 15;
    const Skip = (page - 1) * Limit;

    if (searchQuery) {
      const clients =
        await this.clientService.findClientBySeachQuery(searchQuery);

      if (!clients) return [];

      const ordersByClient = await this.orderModel
        .find({
          client: { $in: clients },
        })
        .populate('client')
        .populate({ path: 'cart.coupon', model: 'Coupon' })
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      if (!ordersByClient) return [];

      return ordersByClient;
    }

    return await this.orderModel
      .find()
      .populate('client')
      .populate({ path: 'cart.coupon', model: 'Coupon' })
      .sort({ createdAt: -1 })
      .limit(Limit)
      .skip(Skip)
      .lean()
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    return await this.orderModel.findById(id).populate('client').exec();
  }

  async findOneWithProduct(selectedProductId) {
    return await this.orderModel.findOne({
      'cart.products.product': selectedProductId,
    });
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

  async findByClient(email) {
    const client = await this.clientService.findOneByEmail(email);
    if (!client) return;

    const orders = await this.orderModel
      .find({ client: client._id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return orders;
  }

  checkIfOrderExpired(createdAt: Date) {
    const expireDate = new Date(createdAt);
    expireDate.setDate(expireDate.getDate() + 1);
    return expireDate > new Date();
  }
}
