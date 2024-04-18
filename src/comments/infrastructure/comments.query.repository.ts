import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/comment.schema';
import { ObjectId } from 'mongodb';
import { commentMapper } from './comments.mapper';
import { SortData } from '../../base/sortData/sortData.model';
import { Pagination } from '../../base/paginationInputDto/paginationOutput';
import { CommentsOutputType } from '../api/model/output/comments.output';

export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  async getCommentById(commentsId: string) {
    const comment = await this.commentModel.find({
      _id: new ObjectId(commentsId),
    });
    const userId = null;
    return commentMapper(userId, comment[0]);
  }
  async getAllByPostId(
    userId: string,
    postId: string,
    sortData: SortData,
  ): Promise<Pagination<CommentsOutputType> | null> {
    const { sortBy, sortDirection, pageSize, pageNumber } = sortData;

    const comments = await this.commentModel
      .find({ postId: postId })
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await this.commentModel.countDocuments({
      postId: postId,
    });
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: comments.map((i) => commentMapper(userId, i)),
    };
  }
}