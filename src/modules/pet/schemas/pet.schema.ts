import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, ObjectId, Types } from 'mongoose';
import { Gender } from 'src/shared/enums/gender.enum';
import { PetType } from 'src/shared/enums/petType.enum';

export type PetDocument = HydratedDocument<Pet>;

@Schema({ timestamps: true })
export class Pet {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: Gender, required: true })
  gender: Gender;

  @Prop({ enum: PetType, required: true })
  type: PetType;

  @Prop({ default: null })
  avatar: string;

  @Prop({ default: 0 })
  weight: number;

  @Prop({ default: false })
  isNeutered: boolean;

  @Prop({ default: null })
  breed: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: ObjectId;

  @Prop({ type: Date, required: true })
  birthday: Date;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
