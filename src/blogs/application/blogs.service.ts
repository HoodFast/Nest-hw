import { BlogsRepository } from '../infrastructure/blogs.repository';
import { Injectable } from '@nestjs/common';
import { createBlogInputType } from '../api/blogs.controller';

@Injectable()
export class BlogService {
  constructor(protected blogsRepository: BlogsRepository) {}

  async findBlog(id: string) {
    return await this.blogsRepository.findPostById(id);
  }
  async createBlog(data: createBlogInputType) {
    return await this.blogsRepository.createBlog(data);
  }
  async updateBlog(id: string, updateDate: createBlogInputType) {
    return await this.blogsRepository.updateBlog(id, updateDate);
  }
  async deleteBlog(id: string) {
    return await this.blogsRepository.deleteBlog(id);
  }
}
