import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, User } from './user.schema';
import { Model } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<IUser>) {}

  async findAll() {
    return await this.userModel.find();
  }
}
