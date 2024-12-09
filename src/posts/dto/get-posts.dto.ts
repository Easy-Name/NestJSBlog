import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class GetPostsBaseDto {
  @IsDate()
  @IsOptional()
  //@Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  //@Type(() => Date)
  endDate?: Date;
}

export class GetPostsDto extends IntersectionType(
  GetPostsBaseDto,
  PaginationQueryDto,
) {}
