import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../authenticated.request';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // Получаем заголовок авторизации, который содержит токен "Bearer ..."
    const authorizationHeader = req.header('Authorization');
    // Если заголовок не передали, выбрасываем ошибку авторизаци
    if (!authorizationHeader) {
      throw new UnauthorizedException();
    }
    // Разбиваем заголовок на схему и токен и забираем токен
    const token = authorizationHeader.split(' ')[1];

    try {
      // Проверяем валидность токена
      if (this.jwtService.verify(token)) {
        // Получаем объект, который зашифрован в токене
        const payload = this.jwtService.decode(token) as { username: string };
        // Получаем пользователя и добавляем в запрос
        req.user = await this.usersService.findOne(payload.username);
        next();
        return;
      }
    } catch (e) {
      // Если токен просрочен или невалидный выбросим ошибку авторизации
      if (e instanceof TokenExpiredError || e instanceof JsonWebTokenError) {
        throw new UnauthorizedException();
      }
    }

    throw new UnauthorizedException();
  }
}
