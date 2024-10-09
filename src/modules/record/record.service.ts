import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserService } from '../user/user.service';
import { PetService } from '../pet/pet.service';
import { CreateReminderDto } from '../reminder/dtos/create-reminder.dto';
import { ERROR_MESSAGES } from 'src/shared/constants/messages';
import { Record } from './schemas/record.schema';
import { CreateRecordDto } from './dtos/create-record.dto';
import { UpdateRecordDto } from './dtos/update-record.dto';

@Injectable()
export class RecordService {
  constructor(
    @InjectModel('Record') private recordModel: Model<Record>,
    private readonly userService: UserService,
    private readonly petService: PetService,
  ) {}

  async findRecordById(recordId: string) {
    return this.recordModel.findOne({ _id: new Types.ObjectId(recordId) });
  }

  async validateUserAndPet(userId: string, petId: string) {
    const [_, pet] = await Promise.all([
      this.userService.validateUserExists(userId),
      this.petService.validatePetExists(petId),
    ]);
    const permission = pet.userId.toString() === userId;
    if (!permission) {
      throw new ForbiddenException(ERROR_MESSAGES.NO_PERMISSION_PET);
    }
    return;
  }

  async validateUserAndRecord(userId: string, recordId: string) {
    await this.userService.validateUserExists(userId);
    const record = await this.findRecordById(recordId);
    if (!record) {
      throw new NotFoundException(ERROR_MESSAGES.RECORD_NOT_FOUND);
    }
    const petId = record.petId.toString();
    await this.validateUserAndPet(userId, petId);
  }
  async getRecordsByPetId(userId: string, petId: string) {
    return this.recordModel.find({ petId: new Types.ObjectId(petId) });
  }

  async createRecord(userId: string, createRecordDto: CreateRecordDto) {
    await this.validateUserAndPet(userId, createRecordDto.petId.toString());
    const newRecord = new this.recordModel({
      ...createRecordDto,
      petId: new Types.ObjectId(createRecordDto.petId),
    });
    return newRecord.save();
  }

  async updateRecord(userId: string, updateRecordDto: UpdateRecordDto) {
    const petId = updateRecordDto.petId;
    if (petId) {
      await this.validateUserAndPet(userId, petId.toString());
    }
    const updatedRecord = await this.recordModel.findByIdAndUpdate(
      new Types.ObjectId(updateRecordDto._id),
      { $set: updateRecordDto },
      { new: true },
    );
    if (!updatedRecord) {
      throw new NotFoundException(ERROR_MESSAGES.RECORD_NOT_FOUND);
    }
    return updatedRecord;
  }

  async deleteRecord(userId: string, recordId: string) {
    await this.validateUserAndRecord(userId, recordId);
    return this.recordModel.deleteOne({
      _id: new Types.ObjectId(recordId),
    });
  }
}
