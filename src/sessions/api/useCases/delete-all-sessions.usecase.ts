import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../base/models/Interlayer';
import { UpdateOutputData } from '../../../base/models/updateOutput';
import { SessionRepository } from '../../infrastructure/session.repository';
//
// export class DeleteAllSessionsCommand {
//   constructor(public userId: string) {}
// }
// @CommandHandler(DeleteAllSessionsCommand)
// export class DeleteAllSessionsUseCase
//   implements
//     ICommandHandler<
//       DeleteAllSessionsCommand,
//       InterlayerNotice<UpdateOutputData>
//     >
// {
//   constructor(private sessionRepository: SessionRepository) {}
//   async execute(
//     command: DeleteAllSessionsCommand,
//   ): Promise<InterlayerNotice<UpdateOutputData>> {
//     const notice = new InterlayerNotice<UpdateOutputData>();
//     const allSessionsByToken =
//       await this.sessionRepository.getAllSessionByUserId(command.userId);
//     if (!allSessionsByToken) {
//       notice.addError('invalid meta data');
//
//       return notice;
//     }
//     for (let i = 0; i < allSessionsByToken.length; i++) {
//       await this.sessionRepository.deleteById(allSessionsByToken[i]._id);
//     }
//
//     notice.addData({ updated: true });
//     return notice;
//   }
// }
