import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../base/models/Interlayer';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { UpdateOutputData } from '../../../base/models/updateOutput';
import { likesStatuses, PostDocument } from '../../domain/post.schema';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UsersSqlQueryRepository } from '../../../users/infrastructure/users.sql.query.repository';

export class UpdateLikesCommand {
  constructor(
    public likesStatuses: likesStatuses,
    public postId: string,
    public userId: string,
  ) {}
}

@CommandHandler(UpdateLikesCommand)
export class UpdateLikesUseCase
  implements
    ICommandHandler<UpdateLikesCommand, InterlayerNotice<UpdateOutputData>>
{
  constructor(
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
    private usersSqlQueryRepository: UsersSqlQueryRepository,
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

    const user = await this.usersSqlQueryRepository.getUserById(command.userId);
    if (!user) {
      notice.addError('user not found');
      return notice;
    }
    post.addLike(command.userId, command.likesStatuses, user.accountData.login);
    await post.save();
    notice.addData({ updated: true });
    return notice;
  }
}
