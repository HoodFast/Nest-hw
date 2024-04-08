import { PostsRepository } from './posts.repository';
import { Injectable } from '@nestjs/common';
import { PostTypeCreate } from './posts.controller';
import { PostsQueryRepository } from './posts.query.repository';

@Injectable()
export class PostService {
  constructor(
    protected postsRepository: PostsRepository,
    protected postQueryRepository: PostsQueryRepository,
  ) {}

  async getAllPosts() {
    return await this.postQueryRepository.getAllPosts();
  }

  async createPost(data: PostTypeCreate) {
    const createdPost = await this.postsRepository.createPost(data);
    return createdPost;
  }

  async findPostById(id: string) {
    return this.postsRepository.findPostById(id);
  }
}
