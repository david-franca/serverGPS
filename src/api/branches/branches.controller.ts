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
import { BranchSwagger } from '../swagger';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@ApiCookieAuth()
@UseInterceptors(ClassSerializerInterceptor, ErrorsInterceptor)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @ApiCreatedResponse({ type: BranchSwagger })
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  @ApiOkResponse({ type: BranchSwagger, isArray: true })
  findAll() {
    return this.branchesService.findAll({});
  }

  @Get(':id')
  @ApiOkResponse({ type: BranchSwagger })
  findOne(@Param() { id }: FindOneParams) {
    return this.branchesService.findOne({ id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: BranchSwagger })
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
  @ApiNoContentResponse()
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
