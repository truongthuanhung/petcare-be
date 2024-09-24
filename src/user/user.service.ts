import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private userModel: Model<User> ) {}
    createUser(createUserDto: any) {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    getUsers() {
        return this.userModel.find();
    }
}
