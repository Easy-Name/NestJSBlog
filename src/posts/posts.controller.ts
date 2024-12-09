import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { PatchPostDto } from './dto/patch-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}
  /*
  @Post()
  @ApiOperation({
    summary: 'Creates a new blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if your post is created successfully',
  })
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Post('cascade')
  @ApiOperation({
    summary: 'Creates a new blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if your post is created successfully',
  })
  createPostCascade(@Body() createPostDto: CreatePostDto) {
    return this.postService.createCascade(createPostDto);
  }*/

  @Post('with-author')
  @ApiOperation({
    summary: 'Creates a new blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if your post is created successfully',
  })
  createWithAuthor(@Body() createPostDto: CreatePostDto) {
    return this.postService.createWithAuthor(createPostDto);
  }

  @Patch()
  @ApiOperation({
    summary: 'Updates an existing blog post by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'You get a 200 response if your post is updated successfully',
  })
  updatePost(@Body() patchPostDto: PatchPostDto) {
    return this.postService.update(patchPostDto);
  }

  @Get()
  public getPosts() {
    return this.postService.findAll();
  }

  @ApiOperation({
    summary: 'Gets all posts from a user',
  })
  @Get('/:UserId')
  public getPostsbyId(
    @Param('UserId') userId: string,
    @Query() postQuery: GetPostsDto,
  ) {
    console.log(postQuery);
    return this.postService.findById(postQuery, +userId);
  }

  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postService.delete(id);
  }

  @Delete('cascade')
  public deletePostCascade(@Query('id', ParseIntPipe) id: number) {
    return this.postService.deleteCascade(id);
  }
}
