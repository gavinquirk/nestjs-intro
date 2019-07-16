import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './user.model';

@Injectable()
export class UsersService {
  // TODO: Remove hardcoded users array, configure for use with db
  private readonly users: any;

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {
    this.users = [
      {
        userId: 1,
        username: 'john',
        password: 'changeme',
      },
      {
        userId: 2,
        username: 'chris',
        password: 'secret',
      },
      {
        userId: 3,
        username: 'maria',
        password: 'guess',
      },
    ];
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async insertUser(userName: string, email: string, password: string) {
    const newUser = new this.userModel({
      userName: userName,
      email: email,
      password: password,
    });
    const result = await newUser.save();
    return result.id as string;
  }
}
