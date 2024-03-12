import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UserCreateDto } from './dtos/user-create.dto';
import { compare, hash } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: UserCreateDto): Promise<User> {
    if (createUserDto.role) throw new Error('Invalid role provided');

    try {
      const newUser = new this.userModel({
        ...createUserDto,
        password: await hash(createUserDto.password, 10),
      });

      return await newUser.save();
    } catch (error) {
      throw error;
    }
  }

  async findOne(): Promise<User> {
    try {
      return await this.userModel.findOne();
    } catch (error) {
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: string): Promise<User | null> {
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async loginUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) return null;

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) throw new Error('Invalid password');

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw error;
    }
  }
}
