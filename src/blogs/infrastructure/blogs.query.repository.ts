import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/blog.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { BlogSortData } from '../../base/sortData/sortData.model';
import { blogMapper } from '../domain/blog.mapper';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}
  async getAllBlogs(sortData: BlogSortData) {
    const { sortBy, sortDirection, searchNameTerm, pageSize, pageNumber } =
      sortData;
    let filter = {};
    if (searchNameTerm) {
      filter = { name: { $regex: searchNameTerm } };
    }
    const mySortDirection = sortDirection == 'asc' ? 1 : -1;
    const blogs = await this.blogModel
      .find(filter)
      .sort({ [sortBy]: mySortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    const totalCount = await this.blogModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount: 2,
      page: 1,
      pageSize: 10,
      totalCount: 12,
      items: [
        {
          id: '66251ffbfae0ade02121de72',
          name: 'Timma',
          description: 'description',
          websiteUrl: 'https://someurl.com',
          isMembership: false,
          createdAt: '2024-04-21T14:14:08.654Z',
        },
        {
          id: '66251ffbfae0ade02121de70',
          name: 'Tima',
          description: 'description',
          websiteUrl: 'https://someurl.com',
          isMembership: false,
          createdAt: '2024-04-21T14:14:08.654Z',
        },
        {
          id: '66251ffbfae0ade02121de6e',
          name: 'Alex',
          description: 'description',
          websiteUrl: 'https://someurl.com',
          isMembership: false,
          createdAt: '2024-04-21T14:14:08.654Z',
        },
        {
          id: '66251ffbfae0ade02121de6c',
          name: 'Alexey',
          description: 'description',
          websiteUrl: 'https://someurl.com',
          isMembership: false,
          createdAt: '2024-04-21T14:14:08.654Z',
        },
        {
          id: '66251ffbfae0ade02121de6a',
          name: 'Andrey',
          description: 'description',
          websiteUrl: 'https://someurl.com',
          isMembership: false,
          createdAt: '2024-04-21T14:14:08.654Z',
        },
        {
          id: '66251ffbfae0ade02121de68',
          name: 'Don',
          description: 'description',
          websiteUrl: 'https://someurl.com',
          isMembership: false,
          createdAt: '2024-04-21T14:14:08.654Z',
        },
        {
          id: '66251ffbfae0ade02121de66',
          name: 'John',
          description: 'description',
          websiteUrl: 'https://someurl.com',
          isMembership: false,
          createdAt: '2024-04-21T14:14:08.654Z',
        },
        {
          id: '66251ffbfae0ade02121de64',
          name: 'Gggrrttt',
          description: 'description',
          websiteUrl: 'https://someurl.com',
          isMembership: false,
          createdAt: '2024-04-21T14:14:08.654Z',
        },
        {
          id: '66251ffafae0ade02121de62',
          name: 'Mima',
          description: 'description',
          websiteUrl: 'https://someurl.com',
          isMembership: false,
          createdAt: '2024-04-21T14:14:08.654Z',
        },
        {
          id: '66251ffafae0ade02121de60',
          name: 'Dima',
          description: 'description',
          websiteUrl: 'https://someurl.com',
          isMembership: false,
          createdAt: '2024-04-21T14:14:08.654Z',
        },
      ],
    };
    // return {
    //   pagesCount,
    //   page: pageNumber,
    //   pageSize,
    //   totalCount,
    //   items: blogs.map(blogMapper),
    // };
  }
  async getBlogById(id: string) {
    const blog = await this.blogModel.find({ _id: new ObjectId(id) });
    if (!blog[0]) return null;
    return blogMapper(blog[0]);
  }
}
