import { randomUUID } from 'crypto';

import {
  badRequestOptions,
  CustomerSwagger,
  ErrorsInterceptor,
  options,
  PrismaParamPipe,
  SentryInterceptor,
  unauthorizedOptions,
  unprocessableOptions,
} from '@common';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { FindOneParams } from '@utils';

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
@ApiUnauthorizedResponse(unauthorizedOptions)
@ApiBadRequestResponse(badRequestOptions)
@Controller('customers')
@UseInterceptors(ErrorsInterceptor, SentryInterceptor)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiCreatedResponse(options('customer', 'POST', CustomerSwagger))
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOkResponse(options('customers', 'GET', CustomerSwagger))
  findAll(@Query(new PrismaParamPipe()) params) {
    return this.customersService.findAll(params);
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
