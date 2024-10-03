import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Like } from './schemas/like.schema';
import { CreateLikeDto } from './dtos/create-like.dto';

@Injectable()
export class LikeService {
  constructor(@InjectModel('Like') private likeModel: Model<Like>) {}

  async findByUserIdAndPostId(userId: string, postId: string) {
    return this.likeModel.findOne({
      userId: new Types.ObjectId(userId),
      postId: new Types.ObjectId(postId),
    });
  }

  async removeLikeByPostId(postId: string) {
    return this.likeModel.deleteMany({ postId: new Types.ObjectId(postId) });
  }

  async addLike(userId: string, createLikeDto: CreateLikeDto) {
    const postId = createLikeDto.postId.toString();
    const like = await this.findByUserIdAndPostId(userId, postId);
    if (!like) {
      const newLike = new this.likeModel({
        postId: new Types.ObjectId(postId),
        userId: new Types.ObjectId(userId),
      });
      return newLike.save();
    }
    await this.likeModel.findByIdAndDelete(like._id);
    return null;
  }
}
