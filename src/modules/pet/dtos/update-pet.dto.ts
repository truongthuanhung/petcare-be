import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { Gender } from 'src/shared/enums/gender.enum';

export class UpdatePetDto {
  @IsNotEmpty()
  _id: ObjectId; 

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsBoolean()
  isNeutered?: boolean;
}
