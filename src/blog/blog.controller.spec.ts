import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { PostDto } from './dto/post.dto';
import { PostReponseDto } from './dto/post-response.dto';
import { GenericFilterDto } from '@pietro/common';
import { AuthGuard } from '@nestjs/passport';
import { PostReponsesDto } from './dto/posts-response.dto';
import { User } from '@pietro/auth';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities';

describe('BlogController', () => {
  let controller: BlogController;
  let blogService: BlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [
        BlogService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
        }],
    })
      .overrideGuard(AuthGuard('jwt')) // Mock AuthGuard for testing
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<BlogController>(BlogController);
    blogService = module.get<BlogService>(BlogService);
  });

  describe('create', () => {
    it('should create a blog post', async () => {
      const userId = { id: 1 };
      const postDto: PostDto = { title: 'Test Title', content: 'Test Content' };
      const expectedResult: PostReponseDto = {
        ...postDto,
        id: 1,
        createdAt: new Date(),
        author: {
          id: 1,
          email: "pippo@pluto.it"
        }
      };

      jest.spyOn(blogService, 'createPost').mockResolvedValue(expectedResult);

      const result = await controller.create(userId, postDto);

      expect(result).toEqual(expectedResult);
      expect(blogService.createPost).toHaveBeenCalledWith(userId, postDto);
    });
  });

  // describe('update', () => {
  //   it('should update a blog post', async () => {
  //     const postId = 1;
  //     const postDto: PostDto = { title: 'Updated Title', content: 'Updated Content' };
  //     const expectedResult: PostReponseDto = {
  //       ...postDto,
  //       id: postId,
  //       createdAt: new Date(),
  //       author: {
  //         id: 1,
  //         email: "pippo@pluto.it"
  //       }
  //     };

  //     jest.spyOn(blogService, 'updatePost').mockResolvedValue(expectedResult);

  //     const result = await controller.update(postId, postDto);

  //     expect(result).toEqual(expectedResult);
  //     expect(blogService.updatePost).toHaveBeenCalledWith(postId, postDto);
  //   });
  // });

  describe('findAll', () => {
    it('should return an array of blog posts', async () => {
      const filter: GenericFilterDto = {
        page: 1,
        pageSize: 10
      };
      const expectedResult: PostReponsesDto = {
        data: [{
          id: 1,
          title: 'Post 1',
          content: "Post 1",
          createdAt: new Date(),
          author: {
            id: 1,
            email: "pippo@pluto.it"
          }
        },
        {
          id: 2,
          title: 'Post 2',
          content: "Post 2",
          createdAt: new Date(),
          author: {
            id: 1,
            email: "pippo@pluto.it"
          }
        }],
        count: 2,
        page: 1,
        totalPages: 1,
        pageSize: 10
      };

      jest.spyOn(blogService, 'findAllPosts').mockResolvedValue(expectedResult);

      const result = await controller.findAll(filter);

      expect(result).toEqual(expectedResult);
      expect(blogService.findAllPosts).toHaveBeenCalledWith(filter);
    });
  });

  describe('findOne', () => {
    it('should return a single blog post', async () => {
      const postId = 1;
      const expectedResult: PostReponseDto = {
        id: 1,
        title: 'Post 1',
        content: "Post 1",
        createdAt: new Date(),
        author: {
          id: 1,
          email: "pippo@pluto.it"
        }
      };

      jest.spyOn(blogService, 'findOnePost').mockResolvedValue(expectedResult);

      const result = await controller.findOne(postId);

      expect(result).toEqual(expectedResult);
      expect(blogService.findOnePost).toHaveBeenCalledWith(postId);
    });
  });

  describe('remove', () => {
    it('should remove a blog post', async () => {
      const postId = 1;

      jest.spyOn(blogService, 'removePost').mockResolvedValue(undefined);

      const result = await controller.remove(postId);

      expect(result).toBeUndefined();
      expect(blogService.removePost).toHaveBeenCalledWith(postId);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
