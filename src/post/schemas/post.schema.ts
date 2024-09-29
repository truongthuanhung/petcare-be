import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ default: 0 })
  comments: number;

  @Prop({ default: 0 })
  likes: number;

  @Prop({
    type: String,
    enum: ['Knowledge', 'Moment', 'LostPet'],
    required: true,
  })
  type: string;

  // Fields for Knowledge type
  @Prop({ type: [String], required: false })
  images?: string[];

  @Prop({ required: false })
  content?: string;

  // Fields for Moment type
  @Prop({ required: false })
  title?: string;

  // Fields for LostPet type
  @Prop({ required: false })
  description?: string;

  @Prop({ required: false })
  location?: string;

  @Prop({ required: false })
  fbLink?: string;

  @Prop({ required: false })
  phoneNo?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
