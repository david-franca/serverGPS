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
import { CustomerSwagger } from '../swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiCookieAuth()
@Controller('customers')
@UseInterceptors(ClassSerializerInterceptor, ErrorsInterceptor)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiCreatedResponse({ type: CustomerSwagger })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOkResponse({ type: CustomerSwagger, isArray: true })
  findAll() {
    return this.customersService.findAll({});
  }

  @Get(':id')
  @ApiOkResponse({ type: CustomerSwagger })
  findOne(@Param() { id }: FindOneParams) {
    return this.customersService.findOne({ id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: CustomerSwagger })
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
  @ApiNoContentResponse()
  remove(@Param() { id }: FindOneParams) {
    return this.customersService.update({
      where: { id },
      data: {
        deleted: true,
      },
    });
  }
}
