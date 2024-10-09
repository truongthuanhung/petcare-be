import { IsString, IsOptional, IsMongoId, IsEnum } from 'class-validator';
import { Types } from 'mongoose';
import { RecordType } from 'src/shared/enums/recordType.enum';

export class UpdateRecordDto {
  @IsMongoId()
  _id: Types.ObjectId;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(RecordType)
  type: RecordType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsMongoId()
  petId: Types.ObjectId;
}
