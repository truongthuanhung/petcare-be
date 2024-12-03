import { Types } from 'mongoose';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { USER_MESSAGES } from 'src/shared/constants/messages';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('users') // Tên nhóm API
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' }) // Mô tả chức năng của endpoint
  @ApiBody({ type: CreateUserDto }) // Định nghĩa payload
  @ApiResponse({ status: 201, description: 'User created successfully.' }) // Phản hồi
  async createUser(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.create(createUserDto);
    return {
      message: USER_MESSAGES.CREATE_USER_SUCCESSFULLY,
      result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiBearerAuth() // Đánh dấu yêu cầu Bearer Token
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved successfully.',
  })
  async getMe(@Request() req) {
    const result = await this.userService.findById(req.user.userId);
    return {
      result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  @ApiOperation({ summary: 'Update the current user profile' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully.',
  })
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.validateUserExists(req.user.userId as string);
    const result = await this.userService.updateUser(
      req.user.userId,
      updateUserDto,
    );
    return {
      message: USER_MESSAGES.UPDATE_ME_SUCCESSFULLY,
      result,
    };
  }
}
