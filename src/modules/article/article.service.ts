import { CommentService } from './comment/comment.service';
import { LikeService } from './like/like.service';
import { UserService } from './../user/user.service';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    private userService: UserService,
    @Inject(forwardRef(() => LikeService)) private likeService: LikeService,
    @Inject(forwardRef(() => CommentService))
    private commentService: CommentService,
  ) {}

  async getAllArticls(): Promise<Article[]> {
    return await this.articleRepository.find();
  }

  async getArticleByUserId(userId: number): Promise<Article[]> {
    const article = await this.articleRepository.find({
      where: {
        userId,
      },
    });
    if (!article) {
      throw new NotFoundException(
        `Article with userId ${userId} does not found`,
      );
    }
    return article;
  }

  async getArticleById(id: number): Promise<Article> {
    const singer = await this.articleRepository.findOne({
      where: { id },
    });
    if (!singer) {
      throw new NotFoundException(`Article with id ${id} does not found`);
    }
    return singer;
  }
  async createNewArticle(
    description: string,
    content: string,
    userId: number,
  ): Promise<Article> {
    const user = await this.userService.getUserById(userId);
    const article = new Article();

    article.content = content;
    article.description = description;
    article.user = user;

    const savedArticle = await article.save();
    delete savedArticle.user.password;
    delete savedArticle.user.salt;
    return savedArticle;
  }

  async deleteArticle(articleId: number): Promise<DeleteResult> {
    const article = await this.getArticleById(articleId);
    for (let i = 0; i < article.like.length; i++) {
      await this.likeService.deleteLike(article.like[i].id);
    }
    for (let i = 0; i < article.comment.length; i++) {
      await this.commentService.deleteComment(article.comment[i].id);
    }

    const result = await this.articleRepository.delete(articleId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Article with id ${articleId} does not found`,
      );
    }
    return result;
  }

  async updateArticle(
    id: number,
    content: string,
    description: string,
  ): Promise<Article> {
    const article = await this.getArticleById(id);

    if (content) {
      article.content = content;
    }
    if (description) {
      article.description = description;
    }
    const savedArticle = await article.save();
    return savedArticle;
  }

  async getLimitedArticle(limit: number): Promise<Article[]> {
    const query = this.articleRepository.createQueryBuilder('article').select();
    if (limit) {
      query.limit(limit);
    }
    const articles = await query
      .leftJoinAndSelect('article.like', 'like')
      .leftJoinAndSelect('article.comment', 'comment')
      .leftJoinAndSelect('article.user', 'users')
      .select(['users.email', 'users.username'])
      .getMany();
    return articles;
  }
  async getFilteredArticls(limit: number, userId: number): Promise<Article[]> {
    const query = this.articleRepository.createQueryBuilder('article').select();
    if (limit) {
      query.limit(limit);
    }
    if (userId) {
      query.where('article.userId LIKE :userId', { userId });
    }
    const articles = await query
      .leftJoinAndSelect('article.like', 'like')
      .leftJoinAndSelect('article.comment', 'comment')
      .getMany();
    return articles;
  }
}
