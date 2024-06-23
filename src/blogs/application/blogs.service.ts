import { BlogsRepository } from '../infrastructure/blogs.repository';
import { Injectable } from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';

@Injectable()
export class BlogService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async deleteBlog(id: string) {
    return await this.blogsRepository.deleteBlog(id);
  }
}
