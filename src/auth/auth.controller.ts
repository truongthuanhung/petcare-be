import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  async updateUser(@Body() authDto: AuthDto) {
    try {
      const result = await this.authService.login(authDto);
      if (!result) {
        throw new UnauthorizedException('Email or password is incorrect');
      }
      return {
        message: 'Login success',
        result,
      };
    } catch (error) {
      throw error;
    }
  }
}
