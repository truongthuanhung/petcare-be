import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth') // Nhóm API cho Authentication
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'User login' }) // Tóm tắt chức năng của endpoint
  @ApiBody({ type: AuthDto }) // Định nghĩa payload (DTO)
  @ApiResponse({ status: 200, description: 'Login successful.' }) // Mô tả phản hồi khi thành công
  @ApiResponse({ status: 401, description: 'Email or password is incorrect.' }) // Mô tả lỗi xác thực
  async login(@Body() authDto: AuthDto) {
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
