import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { Device } from '@prisma/client';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  async create(@Body() createDeviceDto: CreateDeviceDto): Promise<Device> {
    return await this.devicesService.create(createDeviceDto);
  }

  @Get()
  async findAll(): Promise<Device[]> {
    try {
      return await this.devicesService.findAll({ where: { deleted: false } });
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
  async findOne(@Param('id') id: string): Promise<Device> {
    try {
      return await this.devicesService.findOne({ id });
    } catch (e) {
      throw new HttpException(
        {
          message: 'Não encontrado',
        },
        404,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    return await this.devicesService.update({
      where: { id },
      data: updateDeviceDto,
    });
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Device> {
    try {
      return await this.devicesService.update({
        where: {
          id,
        },
        data: {
          deleted: true,
        },
      });
    } catch (e) {
      throw new HttpException(
        {
          message: 'Não encontrado',
        },
        404,
      );
    }
  }
}
