import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(@InjectModel('Comment') private commentModel: Model<Comment>) {}

  async findById(_id: string) {
    return this.commentModel.findOne({ _id: new Types.ObjectId(_id) });
  }

  async addComment(userId: string, createCommentDto: CreateCommentDto) {
    const newComment = new this.commentModel({
      ...createCommentDto,
      postId: new Types.ObjectId(createCommentDto.postId),
      userId: new Types.ObjectId(userId),
    });
    const [result] = await Promise.all([newComment.save()]);
    return result;
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId.toString() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }
    await this.commentModel.findByIdAndDelete(commentId);
    return comment.postId;
  }

  async getCommentsByPostId(postId: string) {
    return this.commentModel.find({
      postId: new Types.ObjectId(postId),
    });
  }
}
