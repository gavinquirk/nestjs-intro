import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from './user.model';

@Injectable()
export class UsersService {
  private saltRounds = 12;

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async insertUser(
    userName: string,
    email: string,
    password: string,
  ): Promise<string> {
    // Hash the password
    const passwordHash = await this.getHash(password);

    // Remove password from memory
    password = undefined;

    // Create user object
    const newUser = new this.userModel({
      userName: userName,
      email: email,
      password: passwordHash,
    });

    // Save user and return id
    return await newUser.save().then(function(res) {
      return res.id;
    });
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

  // Helper method for finding a user by id
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

  // Helper Method for finding a user by username
  async findUserByUsername(userName: string): Promise<User> {
    return this.userModel.findOne({ userName });
  }

  // Hash password
  private async getHash(password: string | undefined): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  // Compare hash
  async compareHash(
    password: string | undefined,
    hash: string | undefined,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
