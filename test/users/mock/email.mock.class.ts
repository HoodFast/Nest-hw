import { UsersService } from '../../../src/users/application/users.service';

export class UsersServiceEmailMock extends UsersService {
  sendMessageOnEmail(): Promise<boolean> {
    console.log('Call mock email');
    return Promise.resolve(true);
  }
}
