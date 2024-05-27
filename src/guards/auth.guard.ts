import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UsersService } from '../users/application/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UsersService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw new UnauthorizedException();
    }
    const auth = request.headers.authorization;
    const authPayload = auth.split(' ')[1];
    const decodePayload = Buffer.from(authPayload, 'base64').toString();
    debugger;
    if (decodePayload !== 'admin:qwerty') throw new UnauthorizedException();
    return true;
  }
}
