import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../base/models/Interlayer';

import { PostsQueryRepository } from '../../infrastructure/posts.query.repository';
import { CommentsRepository } from '../../../comments/infrastructure/comments.repository';
import { CommentDbType } from '../../../comments/domain/comment.schema';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

export class CommandCreateCommentForPostOutput {
  commentId: string;
}
export class CreateCommentForPostCommand {
  constructor(
    public postId: string,
    public content: string,
    public userId: string,
    public createdAt = new Date().toISOString(),
  ) {}
}

@CommandHandler(CreateCommentForPostCommand)
export class CreateCommentForPostUseCase
  implements
    ICommandHandler<
      CreateCommentForPostCommand,
      InterlayerNotice<CommandCreateCommentForPostOutput>
    >
{
  constructor(
    private commentsRepository: CommentsRepository,
    private userRepository: UsersRepository,
    private postQueryRepository: PostsQueryRepository,
  ) {}
  async execute(
    command: CreateCommentForPostCommand,
  ): Promise<InterlayerNotice<CommandCreateCommentForPostOutput>> {
    const notice = new InterlayerNotice<CommandCreateCommentForPostOutput>();
    const { userId, postId, content, createdAt } = command;
    const post = await this.postQueryRepository.getPostById(postId, userId);

    if (!post) {
      notice.addError('post don`t exist', 'user', 1);
      return notice;
    }

    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      notice.addError('user don`t exist', 'user', 1);
      return notice;
    }

    const newComment: CommentDbType = {
      content,
      postId,
      commentatorInfo: {
        userId,
        userLogin: user.accountData.login,
      },
      createdAt,
      likesCount: 0,
      dislikesCount: 0,
      likes: [],
    };

    const result = await this.commentsRepository.createComment(newComment);
    if (!result) {
      notice.addError('blog don`t exist', 'blog', 1);
      return notice;
    }
    notice.addData({ commentId: result.id });
    return notice;
  }
}
