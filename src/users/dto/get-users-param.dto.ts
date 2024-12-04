import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetUsersParamDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number) //need this to convert from string received in request to int
  @ApiPropertyOptional({
    description: 'Get user with a specific ID',
    example: 56,
  })
  id?: number;
}
