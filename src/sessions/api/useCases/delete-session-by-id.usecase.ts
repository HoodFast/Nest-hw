import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../base/models/Interlayer';
import { UpdateOutputData } from '../../../base/models/updateOutput';
import { SessionRepository } from '../../infrastructure/session.repository';
import { ObjectId } from 'mongodb';

export class DeleteSessionByIdCommand {
  constructor(
    public deviceId: string,
    public userId: string,
  ) {}
}
@CommandHandler(DeleteSessionByIdCommand)
export class DeleteSessionByIdUseCase
  implements
    ICommandHandler<
      DeleteSessionByIdCommand,
      InterlayerNotice<UpdateOutputData>
    >
{
  constructor(private sessionRepository: SessionRepository) {}
  async execute(
    command: DeleteSessionByIdCommand,
  ): Promise<InterlayerNotice<UpdateOutputData>> {
    const notice = new InterlayerNotice<UpdateOutputData>();
    const sessionsByDeviceId =
      await this.sessionRepository.getSessionByDeviceId(command.deviceId);
    debugger;
    if (!sessionsByDeviceId) {
      notice.addError('invalid meta data', '1');
      return notice;
    }
    if (sessionsByDeviceId.userId.toString() !== command.userId) {
      notice.addError('forbidden', '2');
      return notice;
    }
    await this.sessionRepository.deleteByDeviceId(command.deviceId);
    notice.addData({ updated: true });
    return notice;
  }
}
