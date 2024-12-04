import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { MetaOptionsService } from './meta-options.service';
import { CreateMetaOptionsDto } from './dtos/create-meta-options.dto';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}

  @Post()
  async create(@Body() createMetaOptions: CreateMetaOptionsDto) {
    return await this.metaOptionsService.create(createMetaOptions);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.metaOptionsService.delete(id);
  }
}
