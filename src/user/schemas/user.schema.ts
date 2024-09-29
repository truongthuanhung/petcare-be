import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Gender } from '.././../shared/enums/gender.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({ default: null })
  location: string;

  @Prop({ enum: Gender, required: true })
  gender: Gender;

  @Prop({ default: null })
  address: string;

  @Prop({ required: true })
  phoneNo: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
