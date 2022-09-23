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
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,
    private userService: UserService,
  ) {}

  async getAllComments(): Promise<Comment[]> {
    return await this.commentRepository.find();
  }

  async getCommentById(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: {
        id,
      },
    });
    if (!comment) {
      throw new NotFoundException(`comment with id ${id} does not found`);
    }
    return comment;
  }
  async getCommentmByUserId(userId: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: {
        userId,
      },
    });
    if (!comment) {
      throw new NotFoundException(
        `comment with userId ${userId} does not found`,
      );
    }
    return comment;
  }
  async createNewComment(
    content: string,
    userId: number,
    articleId: number,
  ): Promise<Comment> {
    const article = await this.articleService.getArticleById(articleId);
    const user = await this.userService.getUserById(userId);
    const comment = new Comment();

    comment.content = content;
    comment.article = article;
    comment.user = user;

    const savedComment = await comment.save();
    return savedComment;
  }
  async updateComment(id: number, content: string): Promise<Comment> {
    const comment = await this.getCommentById(id);

    if (content) {
      comment.content = content;
    }
    const savedcomment = await comment.save();
    return savedcomment;
  }
  async deleteComment(id: number): Promise<DeleteResult> {
    const result = await this.commentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`comment with id ${id} does not found`);
    }
    return result;
  }
}
