import { UserModule } from './../../user/user.module';
import { ArticleModule } from './../article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { Like } from './like.entity';
import { LikeService } from './like.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    forwardRef(() => ArticleModule),
    UserModule,
  ],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
