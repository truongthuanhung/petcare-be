import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    example: 'a@gmail.com',
    description: 'Email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123Aa@hahgal', description: 'Password of the user' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
