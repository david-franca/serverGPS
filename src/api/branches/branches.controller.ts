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
} from '@nestjs/common';

import { FindOneParams } from '../../utils/findOneParams.util';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  findAll() {
    return this.branchesService.findAll({});
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneParams) {
    return this.branchesService.findOne({ id });
  }

  @Patch(':id')
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
