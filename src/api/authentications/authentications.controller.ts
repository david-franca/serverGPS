import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  UseGuards,
  Res,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthenticationGuard } from '../guards/jwt-authentication.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { LocalAuthenticationGuard } from '../guards/localAuthentication.guard';
import { UsersService } from '../users/users.service';
import { AuthenticationsService } from './authentications.service';
import { RegisterDto } from './dto/register.dto';
import { RequestWithUser } from './interface/request.interface';

@Controller('authentication')
export class AuthenticationsController {
  constructor(
    private readonly authenticationsService: AuthenticationsService,
    private readonly userService: UsersService,
  ) {}

  @Post('register')
  async create(@Body() createAuthenticationDto: RegisterDto) {
    return await this.authenticationsService.register(createAuthenticationDto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
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

    await this.userService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      user.id,
    );

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);
    user.password = undefined;
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationsService.getCookieForLogOut(),
    );
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }

  @UseGuards(JwtRefreshGuard)
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

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    request.user.password = undefined;
    return request.user;
  }
}
