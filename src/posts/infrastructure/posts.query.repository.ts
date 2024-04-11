import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../domain/post.schema';
import { Pagination } from '../api/posts.controller';
import { sortData } from '../application/posts.service';
import { postMapper, PostType } from './post.mapper';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async getAllPosts(
    data: sortData,
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
  getPostById(id: string) {
    return this.postModel.find({ _id: new ObjectId(id) });
  }
}
