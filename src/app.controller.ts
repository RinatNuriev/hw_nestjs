import { Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user); // Вернем аутентифицированного пользователя
  }
}
