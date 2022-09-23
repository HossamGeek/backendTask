import { User } from 'src/modules/user/user.entity';
import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  Entity,
  Unique,
  ManyToOne,
} from 'typeorm';
import { Article } from '../article.entity';
@Entity('comment')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne((type) => Article, (article) => article.comment, {
    eager: false,
  })
  article: Article;
  @Column()
  articleId: number;
  @ManyToOne((type) => User, (user) => user.comment, {
    eager: false,
  })
  user: User;
  @Column()
  userId: number;
}
