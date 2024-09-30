import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { hashPassword } from 'src/utils/crypto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findById(_id: string) {
    return this.userModel.findOne({ _id: new Types.ObjectId(_id) });
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async validateUser(email: string, password: string) {
    return this.userModel.findOne({ email, password: hashPassword(password) });
  }

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const user = await this.findByEmail(email);
    if (user) {
      throw new ConflictException('Email already exists');
    }
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashPassword(createUserDto.password),
    });
    return newUser.save();
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const { email } = updateUserDto;
    const existingUser = await this.findByEmail(email);
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new ConflictException('Email already in use');
    }
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

  async validateUserExists(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }
}
