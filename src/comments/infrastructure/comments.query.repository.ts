import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/comment.schema';
import { ObjectId } from 'mongodb';

export class PostsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  getCommentsById(commentsId: string) {
    this.commentModel.find({ _id: new ObjectId(commentsId) });
  }
}
