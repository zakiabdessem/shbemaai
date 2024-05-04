import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from './client.schema';
import { Model, Types } from 'mongoose';
import { ClientCreateDto } from './dtos/create-client.dto';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
  ) {}

  async create(clientCreateDto: ClientCreateDto): Promise<Types.ObjectId> {
    const client = await this.clientModel.findOne({
      email: clientCreateDto.email,
    });

    if (client) {
      client.address.address = clientCreateDto.address.address;
      client.address.willaya = clientCreateDto.address.city;
      client.address.commun = clientCreateDto.address.state;

      await client.save();

      return client._id;
    }

    const newClient = await this.clientModel.create(clientCreateDto);
    return newClient._id;
  }

  async findClientBySeachQuery(searchQuery) {
    const queryConditions: any = {};

    const regex = new RegExp(searchQuery, 'i');
    queryConditions.$or = [
      { email: { $regex: regex } },
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } },
      { 'address.willaya': { $regex: regex } },
      { 'address.commun': { $regex: regex } },
      { 'address.phone': { $regex: regex } },
    ];

    const clients = await this.clientModel.find(queryConditions);
    const clientIds = clients.map((client) => client._id);

    return clientIds;
  }

  async findOneByEmail(email: string) {
    const address = await this.clientModel.findOne({ email });
    return address;
  }
}
