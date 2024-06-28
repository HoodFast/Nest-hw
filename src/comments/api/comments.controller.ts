import { Controller, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCommentCommand } from './use-cases/get-comment-by-id.usecase';
import { InterlayerNotice } from '../../base/models/Interlayer';
import { CommentsOutputType } from './model/output/comments.output';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/:id')
  async getAllCommentsById(@Param() id: string) {
    const command = new GetCommentCommand(id);
    const comment = await this.queryBus.execute<
      GetCommentCommand,
      InterlayerNotice<CommentsOutputType>
    >(command);
    return comment.data;
  }
}
