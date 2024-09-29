import { Types } from 'mongoose';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreatePetDto } from 'src/pet/dtos/create-pet.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdatePetDto } from 'src/pet/dtos/update-pet.dto';
import { CreatePostDto } from 'src/post/dtos/create-post.dto';
import { UpdatePostDto } from 'src/post/dtos/update-post.dto';
import { PostService } from 'src/post/post.service';
import { PetService } from 'src/pet/pet.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly petService: PetService,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.userService.create(createUserDto);
      return {
        message: 'Create user success',
        result,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  @Get()
  getUsers() {
    try {
      return this.userService.getUsers();
    } catch (error) {
      throw new InternalServerErrorException('Failed to get users');
    }
  }

  @Get(':userId/pets')
  async getPetsByUserId(@Param('userId') userId: string) {
    try {
      return this.userService.getPetsByUserId(userId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to get pets');
    }
  }

  @Post(':userId/pets')
  async addPet(@Param('userId') userId: string, @Body() petData: CreatePetDto) {
    try {
      const result = await this.userService.addPet(userId, petData);
      return {
        message: 'Add new pet success',
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':userId/pets/:petId')
  async updatePet(
    @Param('userId') userId: string,
    @Param('petId') petId: string,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    const result = await this.userService.updatePet(
      userId,
      petId,
      updatePetDto,
    );
    return {
      message: 'Update pet success',
      result,
    };
  }

  @Patch(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      await this.userService.updateUser(userId, updateUserDto);
      return {
        message: 'Update user success',
      };
    } catch (error) {
      throw error;
    }
  }

  @Post(':userId/posts')
  async addPost(
    @Param('userId') userId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    try {
      const result = await this.userService.addPost(userId, createPostDto);
      return {
        message: 'Add new post success',
        result,
      };
    } catch (error) {
      throw error;
    }
  }
  @Patch(':userId/posts/:postId')
  async updatePost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const result = await this.userService.updatePost(
      userId,
      postId,
      updatePostDto,
    );
    return {
      message: 'Update post success',
      result,
    };
  }

  @Get(':userId/posts')
  async getPostsByUserId(@Param('userId') userId: string) {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return this.postService.getPostByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  @Get('posts')
  async getPosts() {
    try {
      return this.postService.getPosts();
    } catch (error) {
      throw new InternalServerErrorException('Failed to get posts');
    }
  }

  @Delete(':userId/posts/:postId')
  async deletePost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ) {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.postService.deletePost(userId, postId);
      return {
        message: 'Delete post success',
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':userId/pets/:petId')
  async deletePet(
    @Param('userId') userId: string,
    @Param('petId') petId: string,
  ) {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.petService.deletePet(userId, petId);
      return {
        message: 'Delete pet success',
      };
    } catch (error) {
      throw error;
    }
  }
}
