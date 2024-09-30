import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model, Types } from 'mongoose';
import { UpdatePostDto } from './dtos/update-post.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel('Post') private postModel: Model<Post>) {}

  async findById(_id: string) {
    return this.postModel.findOne({ _id: new Types.ObjectId(_id) });
  }

  async addPost(userId: string, createPostDto: CreatePostDto) {
    const newPost = new this.postModel({
      ...createPostDto,
      userId: new Types.ObjectId(userId),
    });
    return newPost.save();
  }

  async updatePost(userId: string, updatePostDto: UpdatePostDto) {
    const postId = updatePostDto._id.toString();
    const post = await this.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.userId.toString() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to edit this post',
      );
    }
    const updatedPost = await this.postModel.findByIdAndUpdate(
      new Types.ObjectId(postId),
      { $set: updatePostDto },
      { new: true },
    );
    return updatedPost;
  }

  async getPosts(type?: string) {
    const query = type ? { type } : {};
    return this.postModel.find(query);
  }

  async getPostByUserId(userId: string) {
    return this.postModel.find({ userId });
  }

  async deletePost(userId: string, postId: string) {
    const post = await this.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.userId.toString() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this post',
      );
    }
    await this.postModel.findByIdAndDelete(postId);
  }

  async incrementCommentCount(postId: string) {
    await this.postModel.findByIdAndUpdate(
      postId,
      { $inc: { comments: 1 } },
      { new: true },
    );
  }

  async decrementCommentCount(postId: string) {
    await this.postModel.findByIdAndUpdate(
      postId,
      { $inc: { comments: -1 } },
      { new: true },
    );
  }

  async incrementLikeCount(postId: string) {
    await this.postModel.findByIdAndUpdate(
      postId,
      { $inc: { likes: 1 } },
      { new: true },
    );
  }

  async decrementLikeCount(postId: string) {
    await this.postModel.findByIdAndUpdate(
      postId,
      { $inc: { lieks: -1 } },
      { new: true },
    );
  }
}
