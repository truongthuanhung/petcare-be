import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsMongoId()
  postId: Types.ObjectId;
}
