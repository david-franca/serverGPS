import {
  badRequestOptions,
  ErrorsInterceptor,
  unauthorizedOptions,
  unprocessableOptions,
  UserSwagger,
} from '@common';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { RequestWithUser } from '@types';
import { Public } from '@validators';

import { AuthenticationsService } from './authentications.service';
import { RegisterDto } from './dto/register.dto';
import { LoginCredentialsGuard } from '@common';

@ApiCookieAuth()
@ApiUnprocessableEntityResponse(unprocessableOptions)
@ApiUnauthorizedResponse(unauthorizedOptions)
@ApiBadRequestResponse(badRequestOptions)
@ApiTags('auth')
@Controller('authentication')
@UseInterceptors(ErrorsInterceptor, ClassSerializerInterceptor)
export class AuthenticationsController {
  constructor(
    private readonly authenticationsService: AuthenticationsService,
  ) {}

  @Post('register')
  @ApiCreatedResponse({
    type: UserSwagger,
    description: 'Creates user in database.',
  })
  async create(@Body() createAuthenticationDto: RegisterDto) {
    return await this.authenticationsService.register(createAuthenticationDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LoginCredentialsGuard)
  @Post('login')
  @ApiOkResponse({ type: UserSwagger, description: 'Login successfully.' })
  async login(@Req() request: RequestWithUser) {
    return request.user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('log-out')
  @ApiOkResponse({ description: 'Log-out successfully' })
  async logOut(@Req() request: RequestWithUser) {
    request.logOut();
    request.session.cookie.maxAge = 0;
  }

  @Get()
  @ApiOkResponse({
    type: UserSwagger,
    description: 'Returns single user by session Id',
  })
  authenticate(@Req() request: RequestWithUser) {
    const { user } = request;
    user.password = undefined;
    return user;
  }
}
