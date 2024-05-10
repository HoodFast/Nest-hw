import { Controller } from '@nestjs/common';
import { PostService } from '../../posts/application/posts.service';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';

@Controller('auth')
export class PostsController {
  constructor(
    protected postService: PostService,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}
}
