import { UserService } from './../../user/user.service';
import { ArticleService } from './../article.service';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Like } from './like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,
    private userService: UserService,
  ) {}

  async getAllLike(): Promise<Like[]> {
    return await this.likeRepository.find();
  }

  async getLikeById(id: number): Promise<Like> {
    const like = await this.likeRepository.findOne({
      where: {
        id,
      },
    });
    if (!like) {
      throw new NotFoundException(`like with id ${id} does not found`);
    }
    return like;
  }
  async getLikeByUserId(userId: number): Promise<Like> {
    const like = await this.likeRepository.findOne({
      where: {
        userId,
      },
    });
    if (!like) {
      throw new NotFoundException(`like with userId ${userId} does not found`);
    }
    return like;
  }
  async createNewlike(
    isLike: number,
    disLike: number,
    userId: number,
    articleId: number,
  ): Promise<Like> {
    const article = await this.articleService.getArticleById(articleId);
    const user = await this.userService.getUserById(userId);
    const like = new Like();

    like.like = isLike;
    like.dislike = disLike;
    like.article = article;
    like.user = user;

    const savedLike = await like.save();
    return savedLike;
  }
  async updateLike(id: number, isLike: number, disLike: number): Promise<Like> {
    const like = await this.getLikeById(id);

    if (isLike) {
      like.like = isLike;
    }
    if (disLike) {
      like.dislike = disLike;
    }
    const savedlike = await like.save();
    return savedlike;
  }
  async deleteLike(id: number): Promise<DeleteResult> {
    const result = await this.likeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`like with id ${id} does not found`);
    }
    return result;
  }
}
