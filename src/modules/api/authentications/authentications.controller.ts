import { Response } from 'express';

import {
  badRequestOptions,
  ErrorsInterceptor,
  JwtAuthenticationGuard,
  LocalAuthenticationGuard,
  unauthorizedOptions,
  unprocessableOptions,
  UserSwagger,
} from '@common';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
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

import { UsersService } from '../users/users.service';
import { AuthenticationsService } from './authentications.service';
import { RegisterDto } from './dto/register.dto';

@ApiCookieAuth()
@ApiUnprocessableEntityResponse(unprocessableOptions)
@ApiUnauthorizedResponse(unauthorizedOptions)
@ApiBadRequestResponse(badRequestOptions)
@ApiTags('auth')
@Controller('authentication')
@UseInterceptors(ErrorsInterceptor)
export class AuthenticationsController {
  constructor(
    private readonly authenticationsService: AuthenticationsService,
    private readonly userService: UsersService,
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
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  @ApiOkResponse({ type: UserSwagger, description: 'Login successfully.' })
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    const { id, name, username, role } = user;
    const accessTokenCookie =
      this.authenticationsService.getCookieWithJwtAccessToken(
        id,
        name,
        username,
        role,
      );
    const refreshTokenCookie =
      this.authenticationsService.getCookieWithJwtRefreshToken(
        id,
        name,
        username,
        role,
      );

    await this.userService.setCurrentRefreshToken(refreshTokenCookie.token, id);

    this.authenticationsService.setCookies(request.res, [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    delete user.password;
    delete user.refreshToken;
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @ApiOkResponse({ description: 'Log-out successfully' })
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    await this.userService.removeRefreshToken(request.user.id);
    this.authenticationsService.deleteCookies(response, request.cookies);

    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @ApiOkResponse({
    type: UserSwagger,
    description: 'Returns single user by session Id',
  })
  authenticate(@Req() request: RequestWithUser) {
    const { user } = request;
    delete user.password;
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const { id, name, username, role } = request.user;
    const accessTokenCookie =
      this.authenticationsService.getCookieWithJwtAccessToken(
        id,
        name,
        username,
        role,
      );

    this.authenticationsService.setCookies(request.res, [accessTokenCookie]);
    request.user.password = undefined;
    return request.user;
  }
}
