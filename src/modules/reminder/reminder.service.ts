import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reminder } from './schemas/reminder.schema';
import { CreateReminderDto } from './dtos/create-reminder.dto';
import { UserService } from '../user/user.service';
import { PetService } from '../pet/pet.service';
import { UpdateReminderDto } from './dtos/update-reminder.dto';
import { ERROR_MESSAGES } from 'src/shared/constants/messages';

@Injectable()
export class ReminderService {
  constructor(
    @InjectModel('Reminder') private reminderModel: Model<Reminder>,
    private readonly userService: UserService,
    private readonly petService: PetService,
  ) {}

  async findById(_id: string) {
    return this.reminderModel.findOne({ _id: new Types.ObjectId(_id) });
  }

  async validateReminderExists(reminderId: string) {
    const reminder = await this.findById(reminderId);
    if (!reminder) {
      throw new NotFoundException(ERROR_MESSAGES.REMINDER_NOT_FOUND);
    }
    return reminder;
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

  async validateUserAndReminder(userId: string, reminderId: string) {
    const [_, reminder] = await Promise.all([
      this.userService.validateUserExists(userId),
      this.validateReminderExists(reminderId),
    ]);
    const permission = reminder.userId.toString() === userId;
    if (!permission) {
      throw new ForbiddenException(ERROR_MESSAGES.NO_PERMISSION_REMINDER);
    }
    return;
  }

  async getRemindersByUserId(userId: string) {
    return this.reminderModel.find({ userId: new Types.ObjectId(userId) });
  }

  async createReminder(userId: string, createReminderDto: CreateReminderDto) {
    await this.validateUserAndPet(userId, createReminderDto.petId.toString());
    const newReminder = new this.reminderModel({
      ...createReminderDto,
      userId: new Types.ObjectId(userId),
    });
    return newReminder.save();
  }

  async updateReminder(userId: string, updateReminderDto: UpdateReminderDto) {
    const petId = updateReminderDto.petId;
    if (petId) {
      await this.validateUserAndPet(userId, petId.toString());
    }
    const updatedReminder = await this.reminderModel.findByIdAndUpdate(
      new Types.ObjectId(updateReminderDto._id),
      { $set: updateReminderDto },
      { new: true },
    );
    if (!updatedReminder) {
      throw new NotFoundException(ERROR_MESSAGES.REMINDER_NOT_FOUND);
    }
    return updatedReminder;
  }

  async deleteReminder(userId: string, reminderId: string) {
    await this.validateUserAndReminder(userId, reminderId);
    return this.reminderModel.deleteOne({
      _id: new Types.ObjectId(reminderId),
    });
  }
}
