import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDbType,
  CommentDocument,
} from '../domain/comment.schema';
import { Model } from 'mongoose';
import { CommentsQueryRepository } from './comments.query.repository';
import { CommentsOutputType } from '../api/model/output/comments.output';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}
  async createComment(
    createData: CommentDbType,
  ): Promise<CommentsOutputType | null> {
    const res = await this.commentModel.insertMany(createData);
    const comment = await this.commentsQueryRepository.getCommentById(
      res[0].id,
      res[0].commentatorInfo.userId,
    );
    if (!comment) {
      return null;
    }
    return comment;
  }

  async updateComment(id: string, content: string): Promise<boolean> {
    const res = await this.commentModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          content,
        },
      },
    );
    return !!res.matchedCount;
  }

  async deleteById(id: string): Promise<boolean> {
    const res = await this.commentModel.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  }
}
