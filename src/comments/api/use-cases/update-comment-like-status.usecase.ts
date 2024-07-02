import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../base/models/Interlayer';

import { UpdateOutputData } from '../../../base/models/updateOutput';

import { UsersRepository } from '../../../users/infrastructure/users.repository';

import { CommentDocument } from '../../domain/comment.schema';
import { CommentsQueryRepository } from '../../infrastructure/comments.query.repository';
import { likesStatuses } from '../../../posts/domain/post.schema';

export class UpdateCommentLikesCommand {
  constructor(
    public likesStatuses: likesStatuses,
    public commentId: string,
    public userId: string,
  ) {}
}

@CommandHandler(UpdateCommentLikesCommand)
export class UpdateCommentLikesUseCase
  implements
    ICommandHandler<
      UpdateCommentLikesCommand,
      InterlayerNotice<UpdateOutputData>
    >
{
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private usersRepository: UsersRepository,
  ) {}
  async execute(
    command: UpdateCommentLikesCommand,
  ): Promise<InterlayerNotice<UpdateOutputData>> {
    const notice = new InterlayerNotice<UpdateOutputData>();
    const comment: CommentDocument | null =
      await this.commentsQueryRepository.getDBCommentById(command.commentId);
    if (!comment) {
      notice.addError('comment not found');
      return notice;
    }

    const user = await this.usersRepository.getUserById(command.userId);
    if (!user) {
      notice.addError('user not found');
      return notice;
    }
    comment.addLike(command.userId, command.likesStatuses);
    await comment.save();
    notice.addData({ updated: true });
    return notice;
  }
}
