import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async createUser(user: UserEntity) {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async deleteUserByEmail(email: string) {
    return this.userModel.deleteOne({ email }).exec();
  }
}
