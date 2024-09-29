import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PetService } from 'src/pet/pet.service';
import { Pet } from 'src/pet/schemas/pet.schema';
import { CreatePetDto } from 'src/pet/dtos/create-pet.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdatePetDto } from 'src/pet/dtos/update-pet.dto';
import { CreatePostDto } from 'src/post/dtos/create-post.dto';
import { PostService } from 'src/post/post.service';
import { UpdatePostDto } from 'src/post/dtos/update-post.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly petService: PetService,
    private readonly postService: PostService,
  ) {}

  async findById(_id: string) {
    return this.userModel.findOne({ _id: new Types.ObjectId(_id) });
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const user = await this.findByEmail(email);
    if (user) {
      throw new ConflictException('Email already exists');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      new Types.ObjectId(userId),
      { $set: updateUserDto },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  getUsers() {
    return this.userModel.find();
  }

  async getPetsByUserId(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.petService.getPetsByUserId(userId);
  }

  async addPet(userId: string, createPetDto: CreatePetDto) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.petService.addPet(userId, createPetDto);
  }

  async updatePet(userId: string, petId: string, updatePetDto: UpdatePetDto) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.petService.updatePet(userId, petId, updatePetDto);
  }

  async deletePet(userId: string, petId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.petService.deletePet(userId, petId);
  }

  async addPost(userId: string, createPostDto: CreatePostDto) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.postService.addPost(userId, createPostDto);
  }

  async updatePost(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostDto,
  ) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.postService.updatePost(userId, postId, updatePostDto);
  }
}
