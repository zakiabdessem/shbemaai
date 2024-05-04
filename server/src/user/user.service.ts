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
    const newUser = new this.userModel({
      ...createUserDto,
      password: await hash(createUserDto.password, 10),
      pending: false,
      role: 'client',
    });
    newUser.save();

    return newUser;
  }

  async createUserPending(createUserDto: UserCreateDto): Promise<User> {
    try {
      const user = new this.userModel({
        ...createUserDto,
        password: await hash(createUserDto.password, 10),
        role: 'business',
        pending: true,
      });
      return user.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(): Promise<User> {
    return await this.userModel.findOne();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }

  async findOneById(id: string): Promise<User | null> {
    return await this.userModel.findById(id);
  }

  async loginUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) return null;

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) throw new Error('Invalid password');

      return user.toJSON() as User;
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

  async findOneAndUpdate(userId, toUpdate) {
    return await this.userModel.findByIdAndUpdate(userId, toUpdate);
  }
}
