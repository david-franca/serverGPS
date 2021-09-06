import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { ErrorsInterceptor } from '../../interceptors/errors.interceptor';
import { FindOneParams } from '../../utils/findOneParams.util';
import { VehicleSwagger } from '../swagger';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';

@ApiCookieAuth()
@UseInterceptors(ClassSerializerInterceptor, ErrorsInterceptor)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiCreatedResponse({ type: VehicleSwagger })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @ApiOkResponse({ type: VehicleSwagger, isArray: true })
  findAll() {
    return this.vehiclesService.findAll({});
  }

  @Get(':id')
  @ApiOkResponse({ type: VehicleSwagger })
  findOne(@Param() { id }: FindOneParams) {
    return this.vehiclesService.findOne({ id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: VehicleSwagger })
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
  @ApiNoContentResponse()
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
