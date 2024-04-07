import { Injectable } from '@nestjs/common';
import { createBlogInputType, createBlogType } from './blogs.controller';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blog.schema';
import { Model } from 'mongoose';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}
  async findPostById(id: string) {
    return { post: `post ${id}` };
  }
  async createBlog(data: createBlogInputType) {
    const create = new this.blogModel(data);
    return create.save();
  }
  async updateBlog(id: string, updateDate: createBlogInputType) {
    return { id, updateDate };
  }
  async deleteBlog(id: string) {
    return id;
  }
}
