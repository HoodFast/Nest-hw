import { OutputUsersType } from '../api/output/users.output.dto';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { User } from '../domain/user.schema';
import { add } from 'date-fns/add';
import { UsersRepository } from '../infrastructure/users.repository';
import { Injectable } from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';

const saltRounds = 10;
@Injectable()
export class UsersService {
  constructor(
    protected usersRepository: UsersRepository,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}
  async findUser(loginOrEmail: string) {
    const user = await this.usersQueryRepository.findUser(loginOrEmail);
    return user;
  }
  async createUser(
    login: string,
    email: string,
    password: string,
    isConfirmed?: boolean,
  ): Promise<OutputUsersType | null> {
    const user = await this.usersRepository.doesExistByLoginOrEmail(
      login,
      email,
    );

    if (user) return null;
    const createdAt = new Date();

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const userData: User = {
      accountData: { _passwordHash: hash, createdAt, email, login },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: isConfirmed ? isConfirmed : false,
      },
      tokensBlackList: [],
    };
    const createdUser = await this.usersRepository.createUser(userData);
    if (!createdUser) {
      return null;
    }
    // try {
    //   if (!isConfirmed) {
    //     await AuthService.sendConfirmCode(createdUser.email);
    //   }
    // } catch (e) {
    //   return null;
    // }

    return createdUser;
  }
  async deleteUser(userId: string) {
    const deleteUser = await this.usersRepository.deleteUser(userId);
    return deleteUser;
  }
}
