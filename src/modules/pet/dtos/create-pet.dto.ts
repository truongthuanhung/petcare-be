import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsDate,
} from 'class-validator';
import { Gender } from 'src/shared/enums/gender.enum';
import { PetType } from 'src/shared/enums/petType.enum';

export class CreatePetDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsEnum(Gender, { message: 'Gender must be either male or female.' })
  @IsNotEmpty()
  gender: Gender;

  @IsEnum(PetType, { message: 'Pet type must be either cat or dog' })
  @IsNotEmpty()
  type: PetType;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthday: Date;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsNumber()
  weight: number;

  @IsString()
  breed: string;

  @IsBoolean()
  isNeutered: boolean;
}
