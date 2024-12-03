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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from 'src/shared/enums/gender.enum';
import { PetType } from 'src/shared/enums/petType.enum';

export class CreatePetDto {
  @ApiProperty({ example: 'Buddy', description: 'Name of the pet' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 3, description: 'Age of the pet in years' })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    example: Gender.Male,
    enum: Gender,
    description: 'Gender of the pet',
  })
  @IsEnum(Gender, { message: 'Gender must be either male or female.' })
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    example: PetType.Dog,
    enum: PetType,
    description: 'Type of the pet (cat or dog)',
  })
  @IsEnum(PetType, { message: 'Pet type must be either cat or dog' })
  @IsNotEmpty()
  type: PetType;

  @ApiProperty({
    example: '2020-01-01',
    description: 'Birthday of the pet in ISO 8601 format',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthday: Date;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL for the pet',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: 10.5, description: 'Weight of the pet in kilograms' })
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @ApiProperty({ example: 'Labrador', description: 'Breed of the pet' })
  @IsString()
  @IsNotEmpty()
  breed: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the pet is neutered or not',
  })
  @IsBoolean()
  @IsNotEmpty()
  isNeutered: boolean;
}
