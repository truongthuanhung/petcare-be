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
import { UserService } from '../user/user.service';
import { ERROR_MESSAGES } from 'src/shared/constants/messages';
import { CommentService } from '../comment/comment.service';
import { LikeService } from '../like/like.service';
import { CreateCommentDto } from '../comment/dtos/create-comment.dto';
import { CreateLikeDto } from '../like/dtos/create-like.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private postModel: Model<Post>,
    private readonly userService: UserService,
    private readonly commentService: CommentService,
    private readonly likeService: LikeService,
  ) {}

  async findById(_id: string) {
    return this.postModel.findOne({ _id: new Types.ObjectId(_id) });
  }

  async validateUserAndPost(userId: string, postId: string) {
    const post = await this.findById(postId);
    if (!post) {
      throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
    }
    if (post.userId.toString() !== userId) {
      throw new ForbiddenException(ERROR_MESSAGES.NO_PERMISSION_POST);
    }
  }

  async addPost(userId: string, createPostDto: CreatePostDto) {
    await this.userService.validateUserExists(userId);
    const newPost = new this.postModel({
      ...createPostDto,
      userId: new Types.ObjectId(userId),
    });
    return newPost.save();
  }

  async updatePost(userId: string, updatePostDto: UpdatePostDto) {
    await this.userService.validateUserExists(userId);
    const postId = updatePostDto._id.toString();
    await this.validateUserAndPost(userId, postId);
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
    console.log(postId);
    await this.userService.validateUserExists(userId);
    await this.validateUserAndPost(userId, postId);
    await Promise.all([
      this.postModel.findByIdAndDelete(postId),
      this.commentService.deleteCommentByPostId(postId),
      this.likeService.removeLikeByPostId(postId),
    ]);
  }

  async addComment(userId: string, createCommentDto: CreateCommentDto) {
    await this.userService.validateUserExists(userId);
    const { postId } = createCommentDto;
    const post = await this.findById(postId.toString());
    if (!post) {
      throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
    }
    const [result] = await Promise.all([
      this.commentService.addComment(userId, createCommentDto),
      this.incrementCommentCount(createCommentDto.postId.toString()),
    ]);
    return result;
  }

  async deleteComment(userId: string, commentId: string) {
    await this.userService.validateUserExists(userId);
    await this.validateUserAndComment(userId, commentId);
    const postId = await this.commentService.deleteComment(userId, commentId);
    await this.decrementCommentCount(postId.toString());
  }

  async addLike(userId: string, createLikeDto: CreateLikeDto) {
    await this.userService.validateUserExists(userId);
    const postId = createLikeDto.postId.toString();
    const post = await this.findById(postId);
    if (!post) {
      throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
    }
    const result = await this.likeService.addLike(userId, createLikeDto);
    if (result) {
      await this.incrementLikeCount(postId);
    } else {
      await this.decrementLikeCount(postId);
    }
    return result;
  }

  async validateUserAndComment(userId: string, commentId: string) {
    const comment = await this.commentService.findById(commentId);
    if (!comment) {
      throw new NotFoundException(ERROR_MESSAGES.NO_PERMISSION_COMMENT);
    }
    if (comment.userId.toString() !== userId) {
      throw new ForbiddenException(ERROR_MESSAGES.NO_PERMISSION_COMMENT);
    }
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
      { $inc: { likes: -1 } },
      { new: true },
    );
  }
}
