import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

export type LikeDocument = HydratedDocument<Like>;

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId: ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
