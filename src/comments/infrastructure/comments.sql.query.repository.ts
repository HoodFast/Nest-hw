import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/comment.schema';
import { ObjectId } from 'mongodb';
import { commentMapper } from './mappers/comments.mapper';
import { SortData } from '../../base/sortData/sortData.model';
import { Pagination } from '../../base/paginationInputDto/paginationOutput';
import { CommentsOutputType } from '../api/model/output/comments.output';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';
import { DataSource } from 'typeorm';
import { commentSqlMapper } from './mappers/comments.sql.mapper';
import { PostsSqlQueryRepository } from '../../posts/infrastructure/posts.sql.query.repository';

export class CommentsSqlQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    protected postQueryRepository: PostsSqlQueryRepository,
    protected dataSource: DataSource,
  ) {}
  async getCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentsOutputType | null> {
    try {
      debugger;
      const comment = await this.dataSource.query(
        `
    SELECT c."id",
    c."content", 
    c."createdAt",
    c."userId",
    c."postId",
    c."userLogin",
    l."likesStatus" as "myStatus",
    likes."likesCount",
    likes."dislikesCount"
    FROM public."comments" c
    LEFT JOIN public."comments_likes" l 
    ON c."id" = l."commentId" AND l."userId" = $2
    LEFT JOIN (
      SELECT "commentId",
      COUNT(CASE WHEN "likesStatus" = 'Like' THEN 1 END) as "likesCount",
      COUNT(CASE WHEN "likesStatus" = 'Dislike' THEN 1 END) as "dislikesCount"
      FROM public."comments_likes" 
      GROUP BY "commentId"
      ) as "likes" 
      ON likes."commentId" = c."id"
    WHERE c."id" = $1
    `,
        [commentId, userId],
      );

      if (!comment[0]) return null;
      return commentSqlMapper(comment[0]);
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async getAllByPostId(
    userId: string,
    postId: string,
    sortData: SortData,
  ): Promise<Pagination<CommentsOutputType> | null> {
    try {
      const post = await this.postQueryRepository.getPostById(postId);
      if (!post) return null;
      const { sortBy, sortDirection, pageSize, pageNumber } = sortData;
      const offset = (pageNumber - 1) * pageSize;
      const comments = await this.dataSource.query(
        `
    SELECT c."id",
    c."content", 
    c."createdAt",
    c."userId",
    c."postId",
    c."userLogin",
    l."likesStatus" as "myStatus",
    likes."likesCount",
    likes."dislikesCount"
    FROM public."comments" c
    LEFT JOIN public."comments_likes" l 
    ON c."id" = l."commentId" AND l."userId" = $1
    LEFT JOIN (
      SELECT "commentId",
      COUNT(CASE WHEN "likesStatus" = 'Like' THEN 1 END) as "likesCount",
      COUNT(CASE WHEN "likesStatus" = 'Dislike' THEN 1 END) as "dislikesCount"
      FROM public."comments_likes" 
      GROUP BY "commentId"
      ) as "likes" 
      ON likes."commentId" = c."id"
      WHERE c."postId" = $4
      ORDER BY c."${sortBy}" ${sortDirection}
      LIMIT $2 OFFSET $3
      
    `,
        [userId, pageSize, offset, postId],
      );

      const totalCount = await this.dataSource.query(
        `
        SELECT COUNT("id")
        FROM public."comments" c
        WHERE c."postId" = $1
    `,
        [postId],
      );
      const pagesCount = Math.ceil(+totalCount[0].count / pageSize);

      return {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount: +totalCount[0].count,
        items: comments.map((i) => commentSqlMapper(i)),
      };
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }
}
