import { randomUUID } from 'crypto';

import {
  badRequestOptions,
  ErrorsInterceptor,
  options,
  SentryInterceptor,
  unauthorizedOptions,
  unprocessableOptions,
  VehicleSwagger,
} from '@common';
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
import { FindOneParams } from '@utils';

import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';

const paramsOptions: ApiParamOptions = {
  name: 'id',
  example: randomUUID(),
  type: String,
  description: 'UUID of the vehicle',
};

@ApiCookieAuth()
@ApiTags('vehicles')
@ApiUnprocessableEntityResponse(unprocessableOptions)
@ApiUnauthorizedResponse(unauthorizedOptions)
@ApiBadRequestResponse(badRequestOptions)
@UseInterceptors(
  ClassSerializerInterceptor,
  ErrorsInterceptor,
  SentryInterceptor,
)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiCreatedResponse(options('vehicle', 'POST', VehicleSwagger))
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @ApiOkResponse(options('vehicles', 'GET', VehicleSwagger))
  findAll() {
    return this.vehiclesService.findAll({});
  }

  @Get(':id')
  @ApiParam(paramsOptions)
  @ApiOkResponse(options('vehicle', 'GETBYID', VehicleSwagger))
  findOne(@Param() { id }: FindOneParams) {
    return this.vehiclesService.findOne({ id });
  }

  @Patch(':id')
  @ApiParam(paramsOptions)
  @ApiOkResponse(options('vehicle', 'PATCH', VehicleSwagger))
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
  @ApiParam(paramsOptions)
  @ApiNoContentResponse(options('vehicle', 'DELETE'))
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
