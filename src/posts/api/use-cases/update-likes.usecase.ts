import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../base/models/Interlayer';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { UpdateOutputData } from '../../../base/models/updateOutput';
import { likesStatuses, PostDocument } from '../../domain/post.schema';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

export class UpdateLikesCommand {
  constructor(
    public likesStatuses: likesStatuses,
    public postId: string,
    public userId: string,
  ) {}
}

@CommandHandler(UpdateLikesCommand)
export class CreateBlogUseCase
  implements
    ICommandHandler<UpdateLikesCommand, InterlayerNotice<UpdateOutputData>>
{
  constructor(
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
  ) {}
  async execute(
    command: UpdateLikesCommand,
  ): Promise<InterlayerNotice<UpdateOutputData>> {
    const notice = new InterlayerNotice<UpdateOutputData>();
    const post: PostDocument | null = await this.postsRepository.getPostById(
      command.postId,
    );
    if (!post) {
      notice.addError('post not found');
      return notice;
    }
    const user = await this.usersRepository.getUserById(command.userId);
    if (!user) {
      notice.addError('user not found');
      return notice;
    }
    post.addLike(command.userId, command.likesStatuses, user.accountData.login);

    notice.addData({ updated: true });
    return notice;
  }
}
