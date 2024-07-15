import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../base/models/Interlayer';

import { SessionQueryRepository } from '../../infrastructure/session.query.repository';
import { SessionsOutputType } from '../output/session.output';

// export class GetAllSessionCommand {
//   constructor(public userId: string) {}
// }
// @QueryHandler(GetAllSessionCommand)
// export class GetAllSessionUseCase
//   implements
//     IQueryHandler<GetAllSessionCommand, InterlayerNotice<SessionsOutputType[]>>
// {
//   constructor(private sessionQueryRepository: SessionQueryRepository) {}
//   async execute(
//     command: GetAllSessionCommand,
//   ): Promise<InterlayerNotice<SessionsOutputType[]>> {
//     const notice = new InterlayerNotice<SessionsOutputType[]>();
//     const sessions = await this.sessionQueryRepository.getAllSessions(
//       command.userId,
//     );
//
//     if (!sessions) {
//       notice.addError('sessions not found');
//       return notice;
//     }
//     notice.addData(sessions);
//     return notice;
//   }
// }
