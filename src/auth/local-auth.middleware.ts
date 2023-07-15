import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from '../authenticated.request';

@Injectable()
export class LocalAuthMiddleware implements NestMiddleware {
    constructor(private readonly authService: AuthService) {}

    async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const user = await this.authService.validateUser(
            req.body.username,
            req.body.password,
        );

        if (user) {
            req.user = user;
            next();
            return;
        }

        throw new UnauthorizedException();
    }
}
