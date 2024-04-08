import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from './client.schema';
import { Model, Types } from 'mongoose';
import { ClientCreateDto } from './dtos/create-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
  ) {}

  async create(clientCreateDto: ClientCreateDto): Promise<Types.ObjectId> {
    const newClient = await this.clientModel.create(clientCreateDto);
    return newClient._id;
  }
}
