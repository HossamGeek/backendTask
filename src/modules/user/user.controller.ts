import { UserService } from './user.service';
import {
  Body,
  Controller,
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
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { EmailLoginDto } from './dto/email-login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  signUp(@Body('userData') authCredentialsDto: AuthCredentialsDto) {
    console.log('authCredentialsDto: ', authCredentialsDto);
    return this.userService.signUp(authCredentialsDto);
  }
  @Post('login')
  signInUser(@Body('userData') emailLoginDto: EmailLoginDto) {
    return this.userService.signInUser(emailLoginDto);
  }
}
