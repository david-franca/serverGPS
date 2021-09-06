import { Cache } from 'cache-manager';

import {
  Body,
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Device } from '@prisma/client';

import { FindOneParams } from '../../utils/findOneParams.util';
import { PaginationParams } from '../pagination/params.pagination';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(
    private readonly devicesService: DevicesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  async create(@Body() createDeviceDto: CreateDeviceDto): Promise<Device> {
    return await this.devicesService.create(createDeviceDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('GET_DEVICES_CACHE')
  @CacheTTL(60)
  @Get()
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
  async findOne(@Param() { id }: FindOneParams): Promise<Device> {
    return await this.devicesService.findOne({ id });
  }

  @Patch(':id')
  async update(
    @Param() { id }: FindOneParams,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    return await this.devicesService.update({
      where: { id },
      data: updateDeviceDto,
    });
  }

  @HttpCode(204)
  @Delete(':id')
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
