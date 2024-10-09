import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
  ],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
