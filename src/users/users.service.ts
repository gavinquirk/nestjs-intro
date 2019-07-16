import { Injectable, NotFoundException } from '@nestjs/common';
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

  async insertUser(userName: string, email: string, password: string) {
    const newUser = new this.userModel({
      userName: userName,
      email: email,
      password: password,
    });
    const result = await newUser.save();
    return result.id as string;
  }

  async getUsers() {
    const users = await this.userModel.find().exec();
    return users as User[];
  }

  async getSingleUser(userId: string) {
    const user = await this.findUser(userId);
    return {
      id: user.id,
      userName: user.userName,
      email: user.email,
    };
  }

  async updateUser(userId: string, userName: string, email: string) {
    const updatedUser = await this.findUser(userId);
    if (userName) {
      updatedUser.userName = userName;
    }
    if (email) {
      updatedUser.email = email;
    }

    updatedUser.save();
  }

  async deleteUser(userId: string) {
    const result = await this.userModel.deleteOne({ _id: userId }).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find product');
    }
  }

  // Helper function for finding a user
  private async findUser(id: string): Promise<User> {
    let user: User;
    try {
      user = await this.userModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find user');
    }
    if (!user) {
      throw new NotFoundException('Could not find user');
    }
    return user;
  }

  // OLD FUNCTION FOR FINDING USERS FROM HARDCODED ARRAY
  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
