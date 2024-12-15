import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateMetaOptionsDto } from '../../meta-options/dtos/create-meta-options.dto';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({
    description: 'This is the title for the blog post',
    example: 'This is an example title',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(512)
  title: string;

  @ApiProperty({
    description: 'This is the posts type : post, page, story or series',
    enum: postType,
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description: "For Example - 'my-url'",
    example: 'my-blog-post',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  slug: string;

  @ApiProperty({
    description:
      'This is the posts current status: draft, scheduled, review, published',
    enum: postStatus,
  })
  @IsNotEmpty()
  @IsEnum(postStatus)
  status: postStatus;

  @ApiPropertyOptional({
    description: 'This is the posts content',
    example: 'my blog post',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description:
      'Serialize your JSON object else a validation error will be thrown',
    example:
      '{"id":123,"name":"Alice","age":30,"isActive":true,"roles":["admin","editor"],"preferences":{"theme":"dark","notifications":{"email":true,"sms":false},"lastLogin":"2024-11-30T10:45:00Z"}}',
  })
  @IsString()
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Featured image for your blog post',
    example:
      'https://criticalhits.com.br/wp-content/uploads/2024/01/hisoka-696x348.webp',
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiProperty({
    description: 'Post publication date',
    example: '2024-12-01T01:35:24.707Z',
  })
  @IsISO8601()
  @IsNotEmpty()
  publishOn: Date;

  @ApiPropertyOptional({
    description: 'Array of IDs of tags you want to use',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tags?: number[];

  @ApiPropertyOptional({
    type: 'object',
    properties: {
      metaValue: {
        type: 'string', // JSON serialized as a string
        description: 'The metaValue is a JSON string',
        example: '{"SidebarEnabled": true, "footerActive": true}',
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateMetaOptionsDto)
  metaOptions?: CreateMetaOptionsDto | null;
}
