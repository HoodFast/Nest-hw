import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../base/models/Interlayer';

import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { ObjectId } from 'mongodb';

export class CommandDeleteBlogOutputData {
  deleted: boolean;
}
export class DeleteBlogCommand {
  constructor(public blogId: ObjectId) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase
  implements
    ICommandHandler<
      DeleteBlogCommand,
      InterlayerNotice<CommandDeleteBlogOutputData>
    >
{
  constructor(private blogsRepository: BlogsRepository) {}
  async execute(
    command: DeleteBlogCommand,
  ): Promise<InterlayerNotice<CommandDeleteBlogOutputData>> {
    const notice = new InterlayerNotice<CommandDeleteBlogOutputData>();
    const result = await this.blogsRepository.deleteBlog(command.blogId);
    notice.addData({ deleted: result });
    return notice;
  }
}
