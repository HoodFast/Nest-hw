import {
  Controller,
  //   Delete,
  //   ForbiddenException,
  //   Get,
  //   HttpCode,
  //   NotFoundException,
  //   Param,
  //   UseGuards,
} from '@nestjs/common';
// import { AccessTokenAuthGuard } from '../../guards/access.token.auth.guard';
// import { UserId } from '../../decorators/userId';

import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SessionQueryRepository } from '../infrastructure/session.query.repository';
// import { GetAllSessionCommand } from './useCases/get-all-sessions.usecase';
// import { InterlayerNotice } from '../../base/models/Interlayer';
// import { SessionsOutputType } from './output/session.output';
// import { DeleteAllSessionsCommand } from './useCases/delete-all-sessions.usecase';
// import { UpdateOutputData } from '../../base/models/updateOutput';
// import { Token } from '../../decorators/token';
// import { DeleteSessionByIdCommand } from './useCases/delete-session-by-id.usecase';
//
@Controller('security')
export class SecurityController {
  constructor(
    private sessionQueryRepository: SessionQueryRepository,
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}
  //
  //   @UseGuards(AccessTokenAuthGuard)
  //   @Get('/devices')
  //   async getDevices(@UserId() userId: string): Promise<SessionsOutputType[]> {
  //     const command = new GetAllSessionCommand(userId);
  //     const result = await this.queryBus.execute<
  //       GetAllSessionCommand,
  //       InterlayerNotice<SessionsOutputType[]>
  //     >(command);
  //     if (result.hasError())
  //       throw new NotFoundException(result.extensions[0].message);
  //     if (!result.data) throw new NotFoundException();
  //     return result.data;
  //   }
  //   @HttpCode(204)
  //   @UseGuards(AccessTokenAuthGuard)
  //   @Delete('/devices')
  //   async deleteAllDevices(@UserId() userId: string) {
  //     const command = new DeleteAllSessionsCommand(userId);
  //     const result = await this.commandBus.execute<
  //       DeleteAllSessionsCommand,
  //       InterlayerNotice<UpdateOutputData>
  //     >(command);
  //     if (result.hasError())
  //       throw new NotFoundException(result.extensions[0].message);
  //     if (!result.data) throw new NotFoundException();
  //     return;
  //   }
  //   @HttpCode(204)
  //   @UseGuards(AccessTokenAuthGuard)
  //   @Delete('/devices/:id')
  //   async deleteSessionById(
  //     @Token() token: string,
  //     @Param('id') deviceId: string,
  //     @UserId() userId: string,
  //   ) {
  //     const command = new DeleteSessionByIdCommand(token, deviceId, userId);
  //     const result = await this.commandBus.execute<
  //       DeleteSessionByIdCommand,
  //       InterlayerNotice<UpdateOutputData>
  //     >(command);
  //     if (result.hasError()) {
  //       if (result.extensions[0].key === '1') throw new NotFoundException();
  //       if (result.extensions[0].key === '2') throw new ForbiddenException();
  //     }
  //     return;
  //   }
}
