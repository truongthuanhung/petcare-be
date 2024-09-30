import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, ObjectId, Types } from 'mongoose';
import { Gender } from 'src/shared/enums/gender.enum';

export type PetDocument = HydratedDocument<Pet>;

@Schema({ timestamps: true })
export class Pet {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ enum: Gender, required: true })
  gender: Gender;

  @Prop()
  avatar?: string;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  weight: number;

  @Prop({ default: false })
  isNeutered: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: ObjectId;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
