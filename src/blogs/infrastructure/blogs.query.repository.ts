import { Injectable } from '@nestjs/common';
import { queryBlogsInputType } from '../api/blogs.controller';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/blog.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}
  async getAllBlogs(sortData: queryBlogsInputType) {
    return this.blogModel.find().exec();
  }
  async getBlogById(id: string) {
    return await this.blogModel.find({ _id: new ObjectId(id) });
  }
}
