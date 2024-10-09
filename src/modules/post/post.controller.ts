import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from '../user/user.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { CreateCommentDto } from '../comment/dtos/create-comment.dto';
import { CommentService } from '../comment/comment.service';
import { CreateLikeDto } from '../like/dtos/create-like.dto';
import { LikeService } from '../like/like.service';
import { USER_MESSAGES } from 'src/shared/constants/messages';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
    private readonly commentService: CommentService,
    private readonly likeService: LikeService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPosts(@Query('type') type: string) {
    return this.postService.getPosts(type);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addPost(@Request() req, @Body() createPostDto: CreatePostDto) {
    const result = await this.postService.addPost(
      req.user.userId,
      createPostDto,
    );
    return {
      message: USER_MESSAGES.ADD_POST_SUCCESSFULLY,
      result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updatePost(@Request() req, @Body() updatePostDto: UpdatePostDto) {
    const result = await this.postService.updatePost(
      req.user.userId,
      updatePostDto,
    );
    return {
      message: USER_MESSAGES.UPDATE_POST_SUCCESSFULLY,
      result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  async deletePost(@Request() req, @Param('postId') postId: string) {
    const userId = req.user.userId as string;
    await this.postService.deletePost(userId, postId);
    return {
      message: USER_MESSAGES.DELETE_POST_SUCCESSFULLY,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':postId/comments')
  async getCommentsOfPost(@Param('postId') postId: string) {
    const result = await this.commentService.getCommentsByPostId(postId);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('comments')
  async addComment(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    const userId = req.user.userId as string;
    const result = await this.postService.addComment(userId, createCommentDto);
    return {
      message: USER_MESSAGES.ADD_COMMMENT_SUCCESSFULLY,
      result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('likes')
  async addLike(@Request() req, @Body() createLikeDto: CreateLikeDto) {
    const userId = req.user.userId as string;
    const result = await this.postService.addLike(userId, createLikeDto);
    if (result) {
      return {
        message: USER_MESSAGES.LIKE_POST_SUCCESSFULLY,
        result,
      };
    }
    return {
      message: USER_MESSAGES.UNLIKE_POST_SUCCESSFULLY,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comments/:commentId')
  async deleteComment(@Request() req, @Param('commentId') commentId: string) {
    const userId = req.user.userId as string;
    await this.postService.deleteComment(userId, commentId);
    return {
      message: USER_MESSAGES.DELETE_COMMMENT_SUCCESSFULLY,
    };
  }
}
