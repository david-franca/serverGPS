import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { ErrorsInterceptor } from '../../interceptors/errors.interceptor';
import { Public } from '../../validator';
import { LoginCredentialsGuard } from '../guards/loginCredentials.guard';
import { UserSwagger } from '../swagger';
import { AuthenticationsService } from './authentications.service';
import { RegisterDto } from './dto/register.dto';
import { RequestWithUser } from './interface/request.interface';

@ApiCookieAuth()
@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor, ErrorsInterceptor)
export class AuthenticationsController {
  constructor(
    private readonly authenticationsService: AuthenticationsService,
  ) {}

  @Post('register')
  @ApiCreatedResponse({ type: UserSwagger })
  async create(@Body() createAuthenticationDto: RegisterDto) {
    return await this.authenticationsService.register(createAuthenticationDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LoginCredentialsGuard)
  @Post('login')
  @ApiOkResponse({ type: UserSwagger })
  async login(@Req() request: RequestWithUser) {
    return request.user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('log-out')
  @ApiOkResponse()
  async logOut(@Req() request: RequestWithUser) {
    request.logOut();
    request.session.cookie.maxAge = 0;
  }

  @Get()
  @ApiOkResponse({ type: UserSwagger })
  authenticate(@Req() request: RequestWithUser) {
    const { user } = request;
    user.password = undefined;
    return user;
  }

  @Patch(':token')
  async confirmEMail() {
    //
  }
}
