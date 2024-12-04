import { Body, Injectable } from '@nestjs/common';
import { Post } from './posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { UsersService } from 'src/users/users.service';
import { TagsService } from 'src/tags/tags.service';
import { PatchPostDto } from './dto/patch-post.dto';

/**
 *Class to perform business operations on posts
 **/

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    //injecting postsRepository
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    //injecting metaOPtionsRepository
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,

    private readonly tagsService: TagsService,
  ) {}

  /*public async create(@Body() createPostDto: CreatePostDto) {
    //Create MetaOptions

    const metaOption = createPostDto.metaOptions
      ? this.metaOptionRepository.create(createPostDto.metaOptions)
      : null;

    if (metaOption) {
      await this.metaOptionRepository.save(metaOption);
    }

    //Create Post
    let newPost = this.postsRepository.create(createPostDto);

    //Add meta options to post

    if (metaOption) {
      newPost.metaOptions = metaOption;
    }

    //return post to user
    newPost = await this.postsRepository.save(newPost);

    return newPost;
  }

  public async createCascade(@Body() createPostDto: CreatePostDto) {
    //Create Post
    let newPost = this.postsRepository.create(createPostDto);

    //return post to user
    newPost = await this.postsRepository.save(newPost);

    return newPost;
  }*/

  public async createWithAuthor(@Body() createPostDto: CreatePostDto) {
    //find author from database based on authorId
    const author = await this.usersService.findOneById(createPostDto.authorId);

    //find tags
    const tags = await this.tagsService.findMultipleTags(createPostDto.tags);

    //Create Post
    let newPost = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    //return post to user
    newPost = await this.postsRepository.save(newPost);

    return newPost;
  }

  public async findAll() {
    return await this.postsRepository
      .find /*{
      relations: {
        metaOptions: true,
        author: true,
        tags: true,
      },
    }*/
      //used for eager loading for certain relationships
      ();
  }

  public async delete(id: number) {
    //find the post
    const post = await this.postsRepository.findOneBy({ id });
    //delete post
    await this.postsRepository.delete(id);
    //delete meta options
    await this.metaOptionRepository.delete(post.metaOptions.id);
    //confirmation
    return { deleted: true, id };
  }

  public async deleteCascade(id: number) {
    await this.postsRepository.delete(id);
    return { deleted: true, id };
  }

  public async update(patchPostDto: PatchPostDto) {
    //FIND THE TAGS
    const tags = await this.tagsService.findMultipleTags(patchPostDto.tags);

    //FIND THE POST
    const post = await this.postsRepository.findOneBy({ id: patchPostDto.id });

    //UPDATE THE PROPERTIES OF POST
    post.title = patchPostDto.title ?? post.title; // if patchPostDto.title exists, assing it to post.title, if not, maintain the value already there
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    //ASSIGN THE NEW TAGS
    post.tags = tags;
    //SAVE THE POST AND RETURN
    return await this.postsRepository.save(post);
  }
}
