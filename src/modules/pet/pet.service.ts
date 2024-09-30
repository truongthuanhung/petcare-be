import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pet } from './schemas/pet.schema';
import { CreatePetDto } from './dtos/create-pet.dto';
import { UpdatePetDto } from './dtos/update-pet.dto';

@Injectable()
export class PetService {
  constructor(@InjectModel('Pet') private petModel: Model<Pet>) {}

  async findById(_id: string) {
    return this.petModel.findOne({ _id: new Types.ObjectId(_id) });
  }

  async create(createPetDto: CreatePetDto, userId: Types.ObjectId) {
    const newPet = new this.petModel({ ...createPetDto, userId });
    return newPet.save();
  }

  async getPetsByUserId(userId: string) {
    return this.petModel.find({ userId });
  }

  async addPet(userId: string, createPetDto: CreatePetDto) {
    const newPet = new this.petModel({
      ...createPetDto,
      userId: new Types.ObjectId(userId),
    });
    return newPet.save();
  }

  async updatePet(userId: string, updatePetDto: UpdatePetDto) {
    const petId = updatePetDto._id.toString();
    const pet = await this.findById(petId);
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }
    if (pet.userId.toString() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to edit this pet',
      );
    }
    const updatedPet = await this.petModel.findByIdAndUpdate(
      new Types.ObjectId(petId),
      { $set: updatePetDto },
      { new: true },
    );
    return updatedPet;
  }

  async deletePet(userId: string, petId: string) {
    const pet = await this.findById(petId);
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }
    if (pet.userId.toString() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to edit this pet',
      );
    }
    return this.petModel.deleteOne({ _id: new Types.ObjectId(petId) });
  }
}
