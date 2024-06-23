import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../base/models/Interlayer';

import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { ObjectId } from 'mongodb';

export class CommandUpdateBlogData {
  updated: boolean;
}
export class UpdateBlogCommand {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
    public blogId: ObjectId,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase
  implements
    ICommandHandler<UpdateBlogCommand, InterlayerNotice<CommandUpdateBlogData>>
{
  constructor(private blogsRepository: BlogsRepository) {}
  async execute(
    command: UpdateBlogCommand,
  ): Promise<InterlayerNotice<CommandUpdateBlogData>> {
    const notice = new InterlayerNotice<CommandUpdateBlogData>();
    const result = await this.blogsRepository.updateBlog(
      command.blogId,
      command,
    );
    notice.addData({ updated: result });
    return notice;
  }
}
