import { Injectable } from '@nestjs/common';
import { AuthDto } from './dtos/auth.dto';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto) {
    const { email, password } = authDto;
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      return null;
    }
    return {
      access_token: this.jwtService.sign({ userId: user._id }),
    };
  }
}
