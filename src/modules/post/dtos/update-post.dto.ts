import { IsEnum, IsOptional, IsString, IsArray, IsUrl, IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';
import { PostType } from 'src/shared/enums/postType.enum';

export class UpdatePostDto {
  @IsNotEmpty()
  _id: ObjectId;

  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

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
