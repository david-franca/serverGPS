import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { ErrorsInterceptor } from '../../interceptors/errors.interceptor';
import { FindOneParams } from '../../utils/findOneParams.util';

import { CookieAuthenticationGuard } from '../guards/cookie-authentication.guard';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';

@UseInterceptors(ClassSerializerInterceptor, ErrorsInterceptor)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @UseGuards(CookieAuthenticationGuard)
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @UseGuards(CookieAuthenticationGuard)
  findAll() {
    return this.vehiclesService.findAll({});
  }

  @Get(':id')
  @UseGuards(CookieAuthenticationGuard)
  findOne(@Param() { id }: FindOneParams) {
    return this.vehiclesService.findOne({ id });
  }

  @Patch(':id')
  @UseGuards(CookieAuthenticationGuard)
  update(
    @Param() { id }: FindOneParams,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update({
      where: { id },
      data: updateVehicleDto,
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(CookieAuthenticationGuard)
  remove(@Param() { id }: FindOneParams) {
    console.log(id);
    return this.vehiclesService.update({
      where: { id },
      data: {
        deleted: true,
      },
    });
  }
}
