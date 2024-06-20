import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../base/models/Interlayer';

import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class CommandCreateBlogData {
  blogId: string;
}
export class CreateBlogCommand {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
  ) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase
  implements
    ICommandHandler<CreateBlogCommand, InterlayerNotice<CommandCreateBlogData>>
{
  constructor(private blogsRepository: BlogsRepository) {}
  async execute(
    command: CreateBlogCommand,
  ): Promise<InterlayerNotice<CommandCreateBlogData>> {
    const notice = new InterlayerNotice<CommandCreateBlogData>();
    const result = await this.blogsRepository.createBlog(command);
    notice.addData({ blogId: result.id });
    return notice;
  }
}
