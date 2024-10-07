import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../domain/post.schema';

import { postMapper, PostType } from './post.mapper';
import { ObjectId } from 'mongodb';
import { Pagination } from '../../base/paginationInputDto/paginationOutput';
import { SortData } from '../../base/sortData/sortData.model';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';
import { DataSource } from 'typeorm';
import { LikePost } from '../domain/post.sql.entity';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected dataSource: DataSource,
  ) {}

  async getAllPosts(
    data: SortData,
    userId: string,
  ): Promise<Pagination<PostType>> {
    try {
      const { sortBy, sortDirection, pageSize, pageNumber } = data;
      const offset = (pageNumber - 1) * pageSize;

      const allPosts = await this.dataSource.query(
        `
      SELECT post."id", post."title",post."shortDescription",post."content",post."blogId",post."blogName",post."createdAt", post."like_post".likesStatus as "myStatus"
      FROM public."post"
      LEFT JOIN public."like_post" ON post."id" = "like_post".post AND "like_post"."userId" = $5
      ORDER BY $1 $2
      LIMIT $3 OFFSET $4
      `,
        [sortBy, sortDirection, pageSize, offset, userId],
      );

      const posts = await this.postModel
        .find({})
        .sort({ [sortBy]: sortDirection })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

      const totalCount = await this.postModel.countDocuments({});
      const pagesCount = Math.ceil(totalCount / pageSize);
      const items = allPosts.map();
      return {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount,
        items: posts.map((i) => postMapper(i, userId)),
      };
    } catch (e) {
      throw new Error();
    }
  }
  async getPostById(
    postId: string,
    userId: string = '',
  ): Promise<PostType | null> {
    const res = await this.postModel.find({
      _id: new ObjectId(postId),
    });
    if (!res.length) return null;
    return postMapper(res[0], userId);
  }
  async getAllPostsForBlog(
    userId: string,
    blogId: string,
    data: SortData,
  ): Promise<Pagination<PostType> | null> {
    const { sortBy, sortDirection, pageSize, pageNumber } = data;
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) return null;
    const mySortDirection = sortDirection == 'asc' ? 1 : -1;
    const posts = await this.postModel
      .find({ blogId: blogId })
      .sort({ [sortBy]: mySortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await this.postModel.countDocuments({ blogId: blogId });
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts.map((i) => postMapper(i, userId)),
    };
  }
}
