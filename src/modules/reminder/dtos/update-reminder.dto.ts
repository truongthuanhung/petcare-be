import {
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

export class UpdateReminderDto {
  @IsMongoId()
  _id: Types.ObjectId;

  @IsOptional()
  @IsEnum(Frequency)
  frequency?: Frequency;

  @IsOptional()
  @IsEnum(ReminderType)
  type?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  occurDate?: Date;

  @IsOptional()
  @IsMongoId()
  petId: Types.ObjectId;
}
