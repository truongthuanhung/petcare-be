import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { Types } from 'mongoose';
import { RecordType } from 'src/shared/enums/recordType.enum';

export class CreateRecordDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(RecordType)
  type: RecordType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsNotEmpty()
  @IsMongoId()
  petId: Types.ObjectId;
}
