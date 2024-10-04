import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { PaymentType } from 'src/shared/enums/paymentType.enum';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  petName: string;

  @Prop({ required: true })
  price: number;

  @Prop({ enum: PaymentType, required: true })
  type: PaymentType;

  @Prop({ default: null })
  location: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: ObjectId;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
