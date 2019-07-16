import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async addUser(
    @Body('userName') userName: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const generatedId = await this.usersService.insertUser(
      userName,
      email,
      password,
    );
    return { id: generatedId };
  }
}
