import { ArticleController } from './article.controller';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Article } from './article.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../user/stratigies/auth-constants';
import { ArticleService } from './article.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    LikeModule,
    CommentModule,
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
    UserModule,
    LikeModule,
    CommentModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
