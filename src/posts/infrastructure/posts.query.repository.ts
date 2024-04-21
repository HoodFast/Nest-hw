import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../domain/post.schema';

import { postMapper, PostType } from './post.mapper';
import { ObjectId } from 'mongodb';
import { Pagination } from '../../base/paginationInputDto/paginationOutput';
import { SortData } from '../../base/sortData/sortData.model';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async getAllPosts(
    data: SortData,
    userId: string,
  ): Promise<Pagination<PostType>> {
    const { sortBy, sortDirection, pageSize, pageNumber } = data;

    const posts = await this.postModel
      .find({})
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await this.postModel.countDocuments({});
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts.map((i) => postMapper(i, userId)),
    };
  }
  async getPostById(postId: string, userId?: string) {
    const res = await this.postModel.find({
      _id: new ObjectId(postId),
    });
    const id = userId ? userId : '';
    debugger;
    return postMapper(res[0], id);
  }
  async getAllPostsForBlog(
    userId: string,
    blogId: string,
    data: SortData,
  ): Promise<Pagination<PostType> | null> {
    const { sortBy, sortDirection, pageSize, pageNumber } = data;
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) return null;
    const posts = await this.postModel
      .find({ blogId: blogId })
      .sort({ [sortBy]: sortDirection })
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
