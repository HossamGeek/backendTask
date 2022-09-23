import { EmailLoginDto } from './dto/email-login.dto';
import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
}
