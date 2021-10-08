import { randomUUID } from 'crypto';

import {
  badRequestOptions,
  BranchSwagger,
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
@UseInterceptors(ErrorsInterceptor, SentryInterceptor)
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
  findAll(@Query(new PrismaParamPipe()) params) {
    return this.branchesService.findAll(params);
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
