import { randomUUID } from 'crypto';

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
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiParamOptions,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { ErrorsInterceptor } from '../../interceptors/errors.interceptor';
import { FindOneParams } from '../../utils/findOneParams.util';
import {
  badRequestOptions,
  CustomerSwagger,
  forbiddenOptions,
  options,
  unprocessableOptions,
} from '../swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

const paramsOptions: ApiParamOptions = {
  name: 'id',
  example: randomUUID(),
  type: String,
  description: 'UUID of the customer',
};

@ApiCookieAuth()
@ApiTags('customers')
@ApiUnprocessableEntityResponse(unprocessableOptions)
@ApiForbiddenResponse(forbiddenOptions)
@ApiBadRequestResponse(badRequestOptions)
@Controller('customers')
@UseInterceptors(ClassSerializerInterceptor, ErrorsInterceptor)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiCreatedResponse(options('customer', 'POST', CustomerSwagger))
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOkResponse(options('customers', 'GET', CustomerSwagger))
  findAll() {
    return this.customersService.findAll({});
  }

  @Get(':id')
  @ApiParam(paramsOptions)
  @ApiOkResponse(options('customer', 'GETBYID', CustomerSwagger))
  findOne(@Param() { id }: FindOneParams) {
    return this.customersService.findOne({ id });
  }

  @Patch(':id')
  @ApiParam(paramsOptions)
  @ApiOkResponse(options('customer', 'PATCH', CustomerSwagger))
  update(
    @Param() { id }: FindOneParams,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiParam(paramsOptions)
  @ApiNoContentResponse(options('customer', 'DELETE'))
  remove(@Param() { id }: FindOneParams) {
    return this.customersService.update({
      where: { id },
      data: {
        deleted: true,
      },
    });
  }
}
