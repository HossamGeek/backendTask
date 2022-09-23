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
@Entity('like')
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  like: number;

  @Column({ default: 0 })
  dislike: number;
  @ManyToOne((type) => Article, (article) => article.like, {
    eager: false,
  })
  article: Article;
  @Column()
  articleId: number;
  @ManyToOne((type) => User, (user) => user.like, {
    eager: false,
  })
  user: User;
  @Column()
  userId: number;
}
