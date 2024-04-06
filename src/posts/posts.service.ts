import { PostsRepository } from './posts.repository';
import { Injectable } from '@nestjs/common';
@Injectable()
export class PostService {
  constructor(protected postsRepository: PostsRepository) {}

  findPost(id: string) {
    return this.postsRepository.findPostById(id);
  }
}
