import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  Unique,
} from 'typeorm';
import * as bcrybt from 'bcryptjs';
import { Article } from '../article/article.entity';
import { Comment } from '../article/comment/comment.entity';
import { Like } from '../article/like/like.entity';
@Entity('users')
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column()
  email: string;
  @Column()
  salt: string;

  async validationPassword(password: string): Promise<boolean> {
    const hash = await bcrybt.hash(password, this.salt);
    return hash == this.password;
  }


  @OneToMany((type) => Like, (like) => like.user, {
    eager: false,
  })
  like: Like[];
  @OneToMany((type) => Comment, (comment) => comment.user, {
    eager: false,
  })
  comment: Comment[];
  @OneToMany((type) => Article, (article) => article.user, {
    eager: false,
  })
  article: Article[];
}
