import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CookieAuthenticationGuard } from '../guards/cookie-authentication.guard';
import { LoginCredentialsGuard } from '../guards/loginCredentials.guard';
import { AuthenticationsService } from './authentications.service';
import { RegisterDto } from './dto/register.dto';
import { RequestWithUser } from './interface/request.interface';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationsController {
  constructor(
    private readonly authenticationsService: AuthenticationsService,
  ) {}

  @UseGuards(CookieAuthenticationGuard)
  @Post('register')
  async create(@Body() createAuthenticationDto: RegisterDto) {
    return await this.authenticationsService.register(createAuthenticationDto);
  }

  @HttpCode(200)
  @UseGuards(LoginCredentialsGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    return request.user;
  }

  @HttpCode(200)
  @UseGuards(CookieAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser) {
    request.logOut();
    request.session.cookie.maxAge = 0;
  }

  @UseGuards(CookieAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const { user } = request;
    user.password = undefined;
    return user;
  }

  @UseGuards(CookieAuthenticationGuard)
  @Patch(':token')
  async confirmEMail() {
    //
  }
}
