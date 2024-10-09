import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsNumber,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
