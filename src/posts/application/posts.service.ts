import { PostsRepository } from '../infrastructure/posts.repository';
import { Injectable } from '@nestjs/common';
import { PostTypeCreate, QueryPostInputModel } from '../api/posts.controller';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';

export type sortData = {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  pageNumber: number;
  pageSize: number;
};
@Injectable()
export class PostService {
  constructor(
    protected postsRepository: PostsRepository,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}

  async getAllPosts(data: sortData, userId: string) {
    return await this.postsQueryRepository.getAllPosts(data, userId);
  }

  async createPost(data: PostTypeCreate) {
    const createdPost = await this.postsRepository.createPost(data);
    return createdPost;
  }

  async findPostById(id: string) {
    return this.postsQueryRepository.getPostById(id);
  }
}
