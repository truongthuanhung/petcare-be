import { Types } from 'mongoose';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.userService.create(createUserDto);
      return {
        message: 'Create user success',
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@Request() req) {
    try {
      const result = await this.userService.findById(req.user.userId);
      return {
        result,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get users');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    try {
      await this.userService.validateUserExists(req.user.userId as string);
      const result = await this.userService.updateUser(
        req.user.userId,
        updateUserDto,
      );
      return {
        message: 'Update me success',
        result,
      };
    } catch (error) {
      throw error;
    }
  }
}
