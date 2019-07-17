import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // Get user by username
    const user = await this.usersService.findUserByUsername(username);

    // Compare passwords
    const passMatch = await this.usersService.compareHash(pass, user.password);

    if (user && passMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId }; // Will be turned into a token
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
