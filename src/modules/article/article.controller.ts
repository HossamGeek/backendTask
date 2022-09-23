import { ArticleService } from './article.service';
import {
  Body,
  Controller,
  Request,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  ParseIntPipe,
  Res,
  UseGuards,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AcceptedAuthGuard } from '../user/stratigies/accepted-auth.guard';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Post('new')
  @UseGuards(AuthGuard())
  async newArticle(
    @Body('content') content: string,
    @Body('description') description: string,
    @Request() req,
  ) {
    return await this.articleService.createNewArticle(
      description,
      content,
      req.user.id,
    );
  }
  @Get('all/user')
  @UseGuards(AuthGuard())
  async getArticle(@Request() req) {
    return this.articleService.getArticleByUserId(req.user.id);
  }
}
