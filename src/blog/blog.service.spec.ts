import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@pietro/auth';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { BlogService } from './blog.service';
import { PostDto } from './dto/post.dto';

describe('BlogService', () => {
  let service: BlogService;
  let userRepository: Repository<User>;
  let postRepository: Repository<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        { provide: getRepositoryToken(User), useClass: Repository },
        { provide: getRepositoryToken(Post), useClass: Repository },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a post', async () => {
    const user = new User();
    const postDto = new PostDto();
    postDto.title = 'Test title';
    postDto.content = 'Test content';

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
    jest.spyOn(postRepository, 'save').mockImplementation(async (post: Post) => post);

    const result = await service.createPost(1, postDto);

    expect(result.title).toEqual(postDto.title);
    expect(result.content).toEqual(postDto.content);
    expect(result.author).toEqual(user);
  });

  it('should update a post', async () => {
    const post = new Post();
    const postDto = new PostDto();
    postDto.title = 'Test title';
    postDto.content = 'Test content';

    jest.spyOn(postRepository, 'findOne').mockResolvedValue(post);
    jest.spyOn(postRepository, 'save').mockImplementation(async (post: Post) => post);

    const result = await service.updatePost(1, postDto);

    expect(result.title).toEqual(postDto.title);
    expect(result.content).toEqual(postDto.content);
  })

  it('should find all posts', async () => {
    const post = new Post();
    post.title = 'Test title';
    post.content = 'Test content';

    jest.spyOn(postRepository, 'findAndCount').mockResolvedValue([[post], 1]);

    const result = await service.findAllPosts({
      page: 1,
      pageSize: 10,
      orderBy: 'createdAt'
    });

    expect(result.data).toEqual([post]);
    expect(result.data[0].title).toEqual(post.title);
    expect(result.count).toEqual(1);
  });

  it('should find one post', async () => {
    const post = new Post();
    const postDto = new PostDto();
    postDto.title = 'Test title';
    postDto.content = 'Test content';

    jest.spyOn(postRepository, 'findOne').mockResolvedValue(post);

    const result = await service.findOnePost(1);

    expect(result).toEqual(post);
  });

  it('should return an error if the blog post is not found', async () => {
    jest.spyOn(postRepository, 'findOne').mockResolvedValue(undefined);

    await expect(service.findOnePost(1)).rejects.toThrow();
  })
});