import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCommentCommand } from './use-cases/get-comment-by-id.usecase';
import { InterlayerNotice } from '../../base/models/Interlayer';
import { CommentsOutputType } from './model/output/comments.output';
import { AccessTokenAuthGuard } from '../../guards/access.token.auth.guard';
import { likesStatuses } from '../../posts/api/input/likesDtos';
import { UpdateCommentLikesCommand } from './use-cases/update-comment-like-status.usecase';
import { UpdateOutputData } from '../../base/models/updateOutput';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/:id')
  async getCommentById(@Param('id') id: string) {
    const command = new GetCommentCommand(id);

    const comment = await this.queryBus.execute<
      GetCommentCommand,
      InterlayerNotice<CommentsOutputType>
    >(command);
    return comment.data;
  }
  @HttpCode(204)
  @UseGuards(AccessTokenAuthGuard)
  @Put('/:id/like-status')
  async updateCommentLikeStatus(
    @Param('id') commentId: string,
    @Req() req: Request,
    @Body() data: { likeStatus: likesStatuses },
  ) {
    // @ts-ignore
    const userId = req.userId ? req.userId : null;
    const command = new UpdateCommentLikesCommand(
      data.likeStatus,
      commentId,
      userId,
    );

    const updatedLikes = await this.commandBus.execute<
      UpdateCommentLikesCommand,
      InterlayerNotice<UpdateOutputData>
    >(command);

    if (updatedLikes.hasError())
      throw new NotFoundException(`${updatedLikes.extensions}`);
    return;
  }
}
