import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../base/models/Interlayer';

import { PostsRepository } from '../../infrastructure/posts.repository';

export class CommandCreatePostForBlogData {
  title: string;
  content: string;
  shortDescription: string;
  blogId: string;
}
export class CommandCreatePostForBlogOutput {
  postId: string;
}
export class CreatePostForBlogCommand {
  constructor(
    public title: string,
    public content: string,
    public shortDescription: string,
    public blogId: string,
    public createdAt = new Date().toISOString(),
  ) {}
}

@CommandHandler(CreatePostForBlogCommand)
export class CreatePostForBlogUseCase
  implements
    ICommandHandler<
      CreatePostForBlogCommand,
      InterlayerNotice<CommandCreatePostForBlogOutput>
    >
{
  constructor(private postsRepository: PostsRepository) {}
  async execute(
    command: CreatePostForBlogCommand,
  ): Promise<InterlayerNotice<CommandCreatePostForBlogOutput>> {
    const notice = new InterlayerNotice<CommandCreatePostForBlogOutput>();
    const result = await this.postsRepository.createPost(command);
    if (!result) {
      notice.addError('blog don`t exist', 'blog', 1);
      return notice;
    }
    notice.addData({ postId: result.id });
    return notice;
  }
}
