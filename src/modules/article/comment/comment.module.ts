import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { ArticleModule } from '../article.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    forwardRef(() => ArticleModule),
    UserModule,
  ],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
