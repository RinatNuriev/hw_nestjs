import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

const jwtModule = JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '60s' }, // Время жизни токена, спустя которое, токен станет невалидным
});

@Module({
    imports: [UsersModule, jwtModule],
    providers: [AuthService],
    exports: [jwtModule],
})
export class AuthModule {}
