import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
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
import { LikePostDto } from './dtos/like-post.dto';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
    private readonly commentService: CommentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPosts(@Query('type') type: string) {
    try {
      return this.postService.getPosts(type);
    } catch (error) {
      throw new InternalServerErrorException('Failed to get posts');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addPost(@Request() req, @Body() createPostDto: CreatePostDto) {
    try {
      await this.userService.validateUserExists(req.user.userId as string);
      const result = await this.postService.addPost(
        req.user.userId,
        createPostDto,
      );
      return {
        message: 'Add new post success',
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updatePost(@Request() req, @Body() updatePostDto: UpdatePostDto) {
    try {
      await this.userService.validateUserExists(req.user.userId as string);
      const result = await this.postService.updatePost(
        req.user.userId,
        updatePostDto,
      );
      return {
        message: 'Add new post success',
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  async deletePost(@Request() req, @Param('postId') postId: string) {
    try {
      const userId = req.user.userId as string;
      await this.userService.validateUserExists(userId);
      await this.postService.deletePost(userId, postId);
      return {
        message: 'Post deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':postId/comments')
  async getCommentsOfPost(@Request() req, @Param('postId') postId: string) {
    try {
      const userId = req.user.userId as string;
      await this.userService.validateUserExists(userId);
      const result = await this.commentService.getCommentsByPostId(postId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('comments')
  async addComment(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    try {
      const userId = req.user.userId as string;
      await this.userService.validateUserExists(userId);
      const { postId } = createCommentDto;
      const post = await this.postService.findById(postId.toString());
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      const [result] = await Promise.all([
        this.commentService.addComment(userId, createCommentDto),
        this.postService.incrementCommentCount(
          createCommentDto.postId.toString(),
        ),
      ]);
      return {
        message: 'Add new comment success',
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comments/:commentId')
  async deleteComment(@Request() req, @Param('commentId') commentId: string) {
    try {
      const userId = req.user.userId as string;
      await this.userService.validateUserExists(userId);
      const postId = await this.commentService.deleteComment(userId, commentId);
      await this.postService.decrementCommentCount(postId.toString());
      return {
        message: 'Comment deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
