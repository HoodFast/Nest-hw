import { BlogsRepository } from '../infrastructure/blogs.repository';
import { Injectable } from '@nestjs/common';
import { createBlogInputType } from '../api/blogs.controller';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';

@Injectable()
export class BlogService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async createBlog(data: createBlogInputType) {
    return await this.blogsRepository.createBlog(data);
  }
  async updateBlog(blogId: string, updateDate: createBlogInputType) {
    return await this.blogsRepository.updateBlog(blogId, updateDate);
  }
  async deleteBlog(id: string) {
    return await this.blogsRepository.deleteBlog(id);
  }
}
