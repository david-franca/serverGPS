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
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiParamOptions,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import {
  ErrorsInterceptor,
  SentryInterceptor,
} from '../../common/interceptors';
import { FindOneParams } from '../../utils/findOneParams.util';
import {
  badRequestOptions,
  BranchSwagger,
  options,
  unauthorizedOptions,
  unprocessableOptions,
} from '../swagger';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

const paramsOptions: ApiParamOptions = {
  name: 'id',
  example: randomUUID(),
  type: String,
  description: 'UUID of the branch',
};

@ApiCookieAuth()
@ApiTags('branches')
@ApiUnprocessableEntityResponse(unprocessableOptions)
@ApiUnauthorizedResponse(unauthorizedOptions)
@ApiBadRequestResponse(badRequestOptions)
@UseInterceptors(
  ClassSerializerInterceptor,
  ErrorsInterceptor,
  SentryInterceptor,
)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @ApiCreatedResponse(options('branch', 'POST', BranchSwagger))
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  @ApiOkResponse(options('branches', 'GET', BranchSwagger))
  findAll() {
    return this.branchesService.findAll({});
  }

  @Get(':id')
  @ApiParam(paramsOptions)
  @ApiOkResponse(options('branch', 'GETBYID', BranchSwagger))
  findOne(@Param() { id }: FindOneParams) {
    return this.branchesService.findOne({ id });
  }

  @Patch(':id')
  @ApiParam(paramsOptions)
  @ApiOkResponse(options('branch', 'PATCH', BranchSwagger))
  update(
    @Param() { id }: FindOneParams,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    return this.branchesService.update({
      where: { id },
      data: updateBranchDto,
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam(paramsOptions)
  @ApiNoContentResponse(options('branch', 'DELETE'))
  @Delete(':id')
  remove(@Param() { id }: FindOneParams) {
    return this.branchesService.update({
      where: { id },
      data: {
        deleted: true,
      },
    });
  }
}
