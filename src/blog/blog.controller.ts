import { Controller, Post, Put, Get, Delete, UseGuards, Query, Body, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser, GenericFilterDto } from '@pietro/common';
import { BlogService } from './blog.service';
import { PostDto } from './dto/post.dto';
import { Serialize } from '@pietro/common';
import { PostReponseDto } from './dto/post-response.dto';
import { PostReponsesDto } from './dto/posts-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('blog')
@Controller('blog')
export class BlogController {

  constructor(
    private readonly blogService: BlogService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a blog post' })
  @ApiResponse({
    status: 200,
    description: 'The blog post has been successfully created.',
    type: PostReponseDto
  })
  @ApiResponse({ status: 401, description: 'Forbidden.' })
  @Serialize(PostReponseDto)
  @Post()
  async create(@CurrentUser('userId') userId: any, @Body() body: PostDto): Promise<any> {
    return this.blogService.createPost(userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') postId: number, @Body() body: PostDto): Promise<PostReponseDto> {
    return this.blogService.updatePost(postId, body);
  }

  @Serialize(PostReponsesDto)
  @Get()
  async findAll(@Query() filter: GenericFilterDto): Promise<PostReponsesDto> {
    return await this.blogService.findAllPosts(filter);
  }

  @Serialize(PostReponseDto)
  @Get(':id')
  async findOne(@Param('id') postId: number): Promise<PostReponseDto> {
    return await this.blogService.findOnePost(postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') postId: number) {
    return await this.blogService.removePost(postId);
  }
}
