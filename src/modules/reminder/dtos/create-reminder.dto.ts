import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Frequency } from 'src/shared/enums/frequency.enum';
import { Types } from 'mongoose';
import { ReminderType } from 'src/shared/enums/reminderType.enum';

export class CreateReminderDto {
  @IsNotEmpty()
  @IsEnum(Frequency)
  frequency: Frequency;

  @IsNotEmpty()
  @IsEnum(ReminderType)
  type: ReminderType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  occurDate: Date;

  @IsNotEmpty()
  @IsMongoId()
  petId: Types.ObjectId;
}
