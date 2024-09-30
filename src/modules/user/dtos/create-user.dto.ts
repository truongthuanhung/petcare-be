import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { Gender } from 'src/shared/enums/gender.enum';

export class CreateUserDto {
  
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @Length(8, 20)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message: 'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
  })
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @IsOptional()
  @IsString()
  readonly location?: string;

  @IsEnum(Gender, { message: 'Gender must be either male, female, or other.' })
  @IsNotEmpty()
  readonly gender: Gender;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsString()
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must be a 10 digit number.'
  })
  readonly phoneNo: string;
}
