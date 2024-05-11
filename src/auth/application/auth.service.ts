import { UserDocument } from '../../users/domain/user.schema';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';
import bcrypt from 'bcrypt';
import { TokenMetaRepository } from '../infrastructure/tokenMetaRepository';

export class AuthService {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected tokenMetaRepository: TokenMetaRepository,
  ) {}
  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.usersQueryRepository.findUser(loginOrEmail);
    if (!user) return null;
    if (!user.emailConfirmation.isConfirmed) return null;
    const res = await bcrypt.compare(password, user.accountData._passwordHash);
    if (!res) {
      return null;
    } else {
      return user;
    }
  }
  async loginTokensPair(user: UserDocument, ip: string, title: string) {
    const userId = user._id;
    const oldSession = await this.tokenMetaRepository.getSessionForLogin(
      userId,
      title,
    );
    const deviceId = oldSession?.deviceId;
    if (oldSession) {
      await this.tokenMetaRepository.deleteById(oldSession._id);
    }

    const accessToken = await this.jwtService.createJWT(user);
    if (!accessToken) return { code: ResultCode.Forbidden };

    const refreshToken = await this.jwtService.createRefreshJWT(
      user,
      deviceId,
      ip,
      title,
    );
    if (!refreshToken) return { code: ResultCode.Forbidden };

    return { code: ResultCode.Success, data: { accessToken, refreshToken } };
  }
}
