import { BlogsRepository } from '../infrastructure/blogs.repository';
import { Injectable } from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';

@Injectable()
export class BlogService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}
}
