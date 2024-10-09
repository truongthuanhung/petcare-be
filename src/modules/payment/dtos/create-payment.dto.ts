import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentType } from 'src/shared/enums/paymentType.enum';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  petName: string;

  @IsNotEmpty()
  @IsEnum(PaymentType)
  type: PaymentType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  occurDate: Date;
}
