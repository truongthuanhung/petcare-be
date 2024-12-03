import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { Gender } from 'src/shared/enums/gender.enum';
import { PetType } from 'src/shared/enums/petType.enum';

export class UpdatePetDto {
  @ApiPropertyOptional({
    example: '63d2f5b0e4b0e5a9c17c7e8a',
    description: 'ID of the pet to be updated',
  })
  @IsNotEmpty()
  _id: ObjectId;

  @ApiPropertyOptional({
    example: 'Buddy',
    description: 'Updated name of the pet',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 3,
    description: 'Updated age of the pet in years',
  })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({
    example: Gender.Male,
    enum: Gender,
    description: 'Updated gender of the pet',
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    example: PetType.Dog,
    enum: PetType,
    description: 'Updated type of the pet (cat or dog)',
  })
  @IsOptional()
  @IsEnum(PetType)
  type?: PetType;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Updated avatar URL for the pet',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    example: 10.5,
    description: 'Updated weight of the pet in kilograms',
  })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Updated neutering status of the pet',
  })
  @IsOptional()
  @IsBoolean()
  isNeutered?: boolean;

  @ApiPropertyOptional({
    example: 'Labrador',
    description: 'Updated breed of the pet',
  })
  @IsOptional()
  @IsString()
  breed?: string;
}
