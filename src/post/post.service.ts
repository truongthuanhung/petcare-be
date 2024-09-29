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
      userId,
    });
    return newPost.save();
  }

  async updatePost(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostDto,
  ) {
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

  async getPosts() {
    return this.postModel.find();
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
}
