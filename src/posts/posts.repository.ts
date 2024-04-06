import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsRepository {
  findPostById(id: string) {
    return `post ${id}`;
  }
}
