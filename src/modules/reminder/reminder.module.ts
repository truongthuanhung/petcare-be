import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReminderSchema } from './schemas/reminder.schema';
import { ReminderController } from './reminder.controller';
import { UserModule } from '../user/user.module';
import { PetModule } from '../pet/pet.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reminder', schema: ReminderSchema }]),
    UserModule,
    PetModule,
  ],
  controllers: [ReminderController],
  providers: [ReminderService],
  exports: [ReminderService],
})
export class ReminderModule {}
