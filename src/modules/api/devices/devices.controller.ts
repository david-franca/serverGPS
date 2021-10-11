import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';

import {
  badRequestOptions,
  DeviceSwagger,
  ErrorsInterceptor,
  options,
  unauthorizedOptions,
  unprocessableOptions,
} from '@common';
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
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiParamOptions,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Device } from '@prisma/client';
import { FindOneParams } from '@utils';

import { PaginationParams } from '../pagination/params.pagination';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

const paramsOptions: ApiParamOptions = {
  name: 'id',
  example: randomUUID(),
  type: String,
  description: 'UUID of the device',
};

@ApiCookieAuth()
@ApiTags('devices')
@ApiUnprocessableEntityResponse(unprocessableOptions)
@ApiUnauthorizedResponse(unauthorizedOptions)
@ApiBadRequestResponse(badRequestOptions)
@UseInterceptors(ErrorsInterceptor)
@Controller('devices')
export class DevicesController {
  constructor(
    private readonly devicesService: DevicesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  @ApiCreatedResponse(options('device', 'POST', DeviceSwagger))
  async create(@Body() createDeviceDto: CreateDeviceDto): Promise<Device> {
    return this.devicesService.create(createDeviceDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('GET_DEVICES_CACHE')
  @CacheTTL(60)
  @Get()
  @ApiOkResponse(options('devices', 'GET', DeviceSwagger))
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
      throw new InternalServerErrorException({
        message: e.message,
      });
    }
  }

  @Get(':id')
  @ApiParam(paramsOptions)
  @ApiOkResponse(options('device', 'GETBYID', DeviceSwagger))
  async findOne(@Param() { id }: FindOneParams): Promise<Device> {
    return await this.devicesService.findOne({ id });
  }

  @Patch(':id')
  @ApiParam(paramsOptions)
  @ApiOkResponse(options('device', 'PATCH', DeviceSwagger))
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
  @ApiParam(paramsOptions)
  @ApiNoContentResponse(options('device', 'DELETE'))
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
