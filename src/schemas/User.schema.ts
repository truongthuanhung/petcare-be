import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;
  
  @Prop({ required: true })
  hashPassword: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  phoneNo: string;

  @Prop({ required: false })
  avartar: string;
}

export const UserSchema = SchemaFactory.createForClass(User)