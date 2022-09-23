import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { EmailLoginDto } from './dto/email-login.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './stratigies/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    const { username, password, email } = authCredentialsDto;
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('You have entered invalid email');
    }
    const user = new User();
    user.salt = await bcrypt.genSalt();

    if (await this.isValidUsername(username)) {
      throw new ConflictException(
        `Username ${username} is not available, please try another one`,
      );
    } else {
      user.username = username;
    }

    if (await this.checkIfEmailExist(email)) {
      throw new ConflictException(
        `Email ${email} is not available, please try another one`,
      );
    } else {
      user.email = email;
    }
    console.log('user: ', user);
    console.log('this.userRepository: ', this.userRepository);
    user.password = await this.hashPassword(password, user.salt);
    const token = this.generateJwtToken(email);
    await user.save();
    return { token };
  }

  async signInUser(emailLoginDto: EmailLoginDto): Promise<{ token: string }> {
    if (!(await this.isValidEmail(emailLoginDto.email))) {
      throw new BadRequestException('Invalid Email Signature');
    }
    const { email, user } = await this.validationUserPassword(emailLoginDto);
    const token = this.generateJwtToken(email);
    return { token };
  }

  async checkIfEmailExist(email: string): Promise<boolean> {
    const query = this.userRepository.createQueryBuilder('user');
    const isEmailExist = query
      .select('email')
      .where('user.email LIKE :email', { email });
    const count = await isEmailExist.getCount();
    return count >= 1;
  }

  generateJwtToken(email: string) {
    const payload: JwtPayload = { email };
    const jwt = this.jwtService.sign(payload);
    return jwt;
  }
  isValidEmail(email: string) {
    if (email) {
      const pattern =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(email);
    } else return false;
  }
  async checkPassword(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new HttpException('User Does not Found', HttpStatus.NOT_FOUND);
    }
    return await bcrypt.compare(password, user.password);
  }

  async isValidUsername(username: string): Promise<boolean> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .select('username');
    query.where('user.username LIKE :username', { username });
    const count = await query.getCount();
    return count >= 1;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }
  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ username });
  }

  async validationUserPassword(emailLoginDto: EmailLoginDto) {
    const { email, password } = emailLoginDto;
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('user does not found');
    if (user && (await user.validationPassword(password)))
      return { email, user };
    else throw new BadRequestException('your password not correct');
  }

  async hashPassword(password, salt: string): Promise<string> {
    console.log('password, salt: ', password, salt);
    return await bcrypt.hash(password, salt);
  }
}
