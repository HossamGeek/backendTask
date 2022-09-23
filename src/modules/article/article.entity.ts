import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  Unique,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Comment } from './comment/comment.entity';
import { Like } from './like/like.entity';
@Entity('article')
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  content: string;
  @OneToMany((type) => Like, (like) => like.article, {
    eager: true,
  })
  like: Like[];
  @OneToMany((type) => Comment, (comment) => comment.article, {
    eager: true,
  })
  comment: Comment[];
  @ManyToOne((type) => User, (user) => user.article, {
    eager: false,
  })
  user: User;
  @Column()
  userId: number;
}
