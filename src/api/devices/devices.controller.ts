import { Cache } from 'cache-manager';

import {
  Body,
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Device } from '@prisma/client';

import { ErrorsInterceptor } from '../../interceptors/errors.interceptor';
import { FindOneParams } from '../../utils/findOneParams.util';
import { PaginationParams } from '../pagination/params.pagination';
import { DeviceSwagger } from '../swagger';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@ApiCookieAuth()
@UseInterceptors(ClassSerializerInterceptor, ErrorsInterceptor)
@Controller('devices')
export class DevicesController {
  constructor(
    private readonly devicesService: DevicesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: DeviceSwagger,
    description: 'The device has been successfully created',
  })
  async create(@Body() createDeviceDto: CreateDeviceDto): Promise<Device> {
    return this.devicesService.create(createDeviceDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('GET_DEVICES_CACHE')
  @CacheTTL(60)
  @Get()
  @ApiOkResponse({ type: DeviceSwagger })
  async findAll(
    @Query('search') search: string,
    @Query() { take, skip, order, sort }: PaginationParams,
  ): Promise<Device[]> {
    try {
      if (search) {
        const searchArray = search.split('=');

        return await this.devicesService.searchAll({
          where: {
            [`${searchArray[0]}`]: searchArray[1],
            deleted: false,
          },
          take,
          skip,
          orderBy: {
            [order]: sort,
          },
        });
      }
      return await this.devicesService.findAll({
        where: { deleted: false },
        take,
        skip,
      });
    } catch (e) {
      throw new HttpException(
        {
          message: e.message,
        },
        500,
      );
    }
  }

  @Get(':id')
  @ApiOkResponse({ type: DeviceSwagger })
  async findOne(@Param() { id }: FindOneParams): Promise<Device> {
    return await this.devicesService.findOne({ id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: DeviceSwagger })
  async update(
    @Param() { id }: FindOneParams,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    return await this.devicesService.update({
      where: { id },
      data: updateDeviceDto,
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiNoContentResponse()
  async remove(@Param() { id }: FindOneParams): Promise<Device> {
    return await this.devicesService.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    });
  }
}
