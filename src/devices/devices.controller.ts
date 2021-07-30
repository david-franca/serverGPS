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
import { GetDeviceDto } from './dto/get-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  async create(@Body() createDeviceDto: CreateDeviceDto): Promise<Device> {
    return await this.devicesService.create(createDeviceDto);
  }

  @Get()
  async findAll(): Promise<GetDeviceDto[]> {
    try {
      const devicesDTO: GetDeviceDto[] = [];
      const devices = await this.devicesService.findAll({});
      devices.forEach((device) => {
        devicesDTO.push({
          active: device.active,
          chipNumber: device.chipNumber,
          code: device.code,
          createAt: device.createAt,
          deleted: device.deleted,
          description: device.description,
          equipmentNumber: Number(device.equipmentNumber),
          id: device.id,
          mobileOperator: device.mobileOperator,
          model: device.model,
          phone: device.phone,
          timezone: device.timezone,
          updateAt: device.updateAt,
        });
      });
      return devicesDTO;
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
    return await this.devicesService.findOne({ id });
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
      return await this.devicesService.remove({ id });
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
