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

import { FindOneParams } from '../../utils/findOneParams.util';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
@UseInterceptors(ClassSerializerInterceptor)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customersService.findAll({});
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneParams) {
    return this.customersService.findOne({ id });
  }

  @Patch(':id')
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
  remove(@Param() { id }: FindOneParams) {
    return this.customersService.update({
      where: { id },
      data: {
        deleted: true,
      },
    });
  }
}
