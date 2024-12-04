import { Injectable } from '@nestjs/common';
import { CreateMetaOptionsDto } from './dtos/create-meta-options.dto';
import { MetaOption } from './meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    //injecting metaOptionsRepository
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}
  public async create(createMetaOption: CreateMetaOptionsDto) {
    let metaOption = this.metaOptionRepository.create(createMetaOption);
    metaOption = await this.metaOptionRepository.save(metaOption);
    return metaOption;
  }

  public async delete(id: number) {
    return await this.metaOptionRepository.delete(id);
  }
}
