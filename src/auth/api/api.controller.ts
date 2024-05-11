import { Body, Controller, Req, Res } from '@nestjs/common';
import { PostService } from '../../posts/application/posts.service';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import { LoginDto } from './input/login.dto';
import { Request, Response } from 'express';
import { AuthService } from '../application/auth.service';

@Controller('auth')
export class PostsController {
  constructor(protected authService: AuthService) {}
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const title = req.headers['user-agent'] || 'none title';
    const ip = req.ip || 'none ip';
    const user = await this.authService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password,
    );
    if (!user) return res.sendStatus(401);
    const tokens = await this.authService.loginTokensPair(user, ip, title);
  }
}
