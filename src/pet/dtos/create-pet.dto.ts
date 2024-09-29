import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Gender } from 'src/shared/enums/gender.enum';

export class CreatePetDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsEnum(Gender, { message: 'Gender must be either male, female, or other.' })
  @IsNotEmpty()
  readonly gender: Gender;

  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @IsNumber()
  height: number;

  @IsNumber()
  weight: number;

  @IsBoolean()
  isNeutered: boolean;
}
