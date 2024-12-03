import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Smith', description: 'Name of the user' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 'john.smith@example.com',
    description: 'Email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd!',
    description:
      'Password with at least one uppercase, one lowercase, one number, and one special character',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @Length(8, 20)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message:
      'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  readonly password: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'URL of the user avatar',
  })
  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @ApiPropertyOptional({
    example: 'New York, USA',
    description: 'Location of the user',
  })
  @IsOptional()
  @IsString()
  readonly location?: string;

  @ApiPropertyOptional({
    example: 100,
    description: 'Activity points of the user',
  })
  @IsOptional()
  @IsNumber()
  readonly activity_point?: number;
}
