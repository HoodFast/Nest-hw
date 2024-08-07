import { SessionRepository } from '../../sessions/infrastructure/session.repository';
import { JwtService } from '../infrastructure/jwt.service';
import { UsersService } from '../../users/application/users.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { EmailService } from '../infrastructure/email.service';
import { UserDocument } from '../../users/domain/user.schema';
const jwt = require('jsonwebtoken');
@Injectable()
export class AuthService {
  constructor(
    protected usersService: UsersService,
    protected sessionRepository: SessionRepository,
    protected jwtService: JwtService,
    protected usersQueryRepository: UsersQueryRepository,
    protected usersRepository: UsersRepository,
    protected emailService: EmailService,
  ) {}
  async confirmEmail(code: string) {
    const user = await this.usersQueryRepository.getUserByCode(code);
    if (!user) throw new BadRequestException('invalid code', 'code');
    if (user?.emailConfirmation.isConfirmed)
      throw new BadRequestException('code is already confirm', 'code');
    if (user?.emailConfirmation.expirationDate < new Date()) {
      throw new BadRequestException({
        message: 'expired',
        field: 'expirationDate',
      });
    }
    const confirmEmail = await this.usersRepository.confirmEmail(user._id);
    return confirmEmail;
  }
  async sendRecovery(email: string) {
    const subject = 'Password recovery';
    const recoveryCode = this.jwtService.createRecoveryCode(email);
    const message = `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
      </p>`;
    try {
      await this.emailService.sendEmail(email, subject, message);
    } catch (e) {
      return;
    }
    return;
  }

  async loginTokensPair(
    loginOrEmail: string,
    password: string,
    ip: string,
    title: string,
  ) {
    const userId = await this.usersService.checkCredentials(
      loginOrEmail,
      password,
    );

    if (!userId) return null;
    const oldSession = await this.sessionRepository.getSessionForUserId(
      userId.toString(),
      title,
    );
    const deviceId = oldSession?.deviceId || randomUUID();

    if (oldSession) {
      await this.sessionRepository.deleteById(oldSession._id);
    }

    const accessToken = await this.jwtService.createJWT(userId);
    if (!accessToken) return null;

    const refreshToken = await this.jwtService.createRefreshJWT(
      userId,
      deviceId,
      ip,
      title,
    );
    if (!refreshToken) return null;
    // const decoded = jwt.decode(refreshToken, { complete: true });
    // const iat = await this.jwtService.getIatFromToken(refreshToken);
    // const tokenMetaData: Session = {
    //   iat,
    //   deviceId,
    //   expireDate: decoded.payload.exp,
    //   userId,
    //   ip,
    //   title,
    // };
    // const setTokenMetaData =
    //   await this.sessionRepository.createNewSession(tokenMetaData);
    // if (!setTokenMetaData) return null;
    return { accessToken, refreshToken };
  }

  async refreshTokensPair(
    user: UserDocument,
    ip: string,
    title: string,
    token: string,
  ) {
    const session = await this.jwtService.getSessionDataByToken(token);
    if (!session)
      throw new UnauthorizedException('couldn`t get the data session');

    const oldSession =
      await this.sessionRepository.getSessionForRefreshDecodeToken(
        session.iat.toISOString(),
        session.deviceId,
      );

    const deviceId = oldSession?.deviceId;
    if (oldSession) {
      await this.sessionRepository.deleteById(oldSession._id);
    } else {
      throw new UnauthorizedException('The old session is gone');
    }
    const accessToken = await this.jwtService.createJWT(user._id);
    const refreshToken = await this.jwtService.createRefreshJWT(
      user._id,
      deviceId,
      ip,
      title,
    );
    return { accessToken, refreshToken };
  }
  async resendConfirmationCode(email: string) {
    const user = await this.usersQueryRepository.findUser(email);
    if (!user) throw new BadRequestException('mail doesnt exist', 'email');
    if (user?.emailConfirmation.isConfirmed)
      throw new BadRequestException('code is already confirm', 'email');
    const newConfirmCode = randomUUID();
    const updateConfirmCode = await this.usersRepository.updateNewConfirmCode(
      user?._id,
      newConfirmCode,
    );
    if (!updateConfirmCode) return false;
    const subject = 'Email Confirmation';
    const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${newConfirmCode}'>complete registration</a>
        </p>`;
    const sendMail = await this.emailService.sendEmail(email, subject, message);
    return sendMail;
  }
  async deleteSession(token: string): Promise<boolean> {
    const dataSession = await this.jwtService.getSessionDataByToken(token);
    if (!dataSession) return false;
    const oldSession =
      await this.sessionRepository.getSessionForRefreshDecodeToken(
        dataSession.iat.toISOString(),
        dataSession.deviceId,
      );
    if (oldSession) {
      await this.sessionRepository.deleteById(oldSession.id);
    } else {
      return false;
    }
    return true;
  }
  async deleteSessionUsingLogin(
    userId: string,
    title: string,
  ): Promise<boolean> {
    const dataSession = await this.sessionRepository.getSessionForUserId(
      userId,
      title,
    );
    if (!dataSession) return false;

    await this.sessionRepository.deleteById(dataSession.id);

    return true;
  }
}
