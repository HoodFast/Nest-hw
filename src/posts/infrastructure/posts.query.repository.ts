import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../domain/post.schema';

import { postMapper, PostType } from './post.mapper';
import { ObjectId } from 'mongodb';
import { Pagination } from '../../base/paginationInputDto/paginationOutput';
import { SortData } from '../../base/sortData/sortData.model';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

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
  async getPostById(postId: string, userId: string) {
    const res = await this.postModel.find({
      _id: new ObjectId(postId),
    });
    return postMapper(res[0], userId);
  }
}
