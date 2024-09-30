import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongoose';

export class LikePostDto {
  @IsMongoId()
  postId: ObjectId;
}
