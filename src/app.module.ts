import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Category } from './category/entities/category.entity';
import { UsersModule } from './users/users.module';
import { Post } from './posts/entities/post.entity';
import { AuthModule } from './auth/auth.module';
import { LocalAuthMiddleware } from './auth/local-auth.middleware';
import { AuthService } from './auth/auth.service';
import { JwtAuthMiddleware } from './auth/jwt-auth.middleware';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: 3306,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DBNAME,
            entities: [Category, Post],
            synchronize: true,
        }),
        CategoryModule,
        PostsModule,
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService, AuthService],
})
export class AppModule {
    constructor(private dataSource: DataSource) {}

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LocalAuthMiddleware)
            .forRoutes({ path: 'auth/login', method: RequestMethod.POST });

        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes({ path: 'profile', method: RequestMethod.GET });
    }
}
