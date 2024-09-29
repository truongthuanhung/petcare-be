import { IsEnum, IsOptional, IsString, IsArray, IsUrl } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsEnum(['Knowledge', 'Moment', 'LostPet'])
  type?: string;

  // Common fields
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  // Fields for Knowledge type
  @IsOptional()
  @IsString()
  content?: string;

  // Fields for Moment type
  @IsOptional()
  @IsString()
  title?: string;

  // Fields for LostPet type
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUrl()
  fbLink?: string;

  @IsOptional()
  @IsString()
  phoneNo?: string;
}
