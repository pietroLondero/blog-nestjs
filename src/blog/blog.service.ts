import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@pietro/auth';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PaginationService } from '@pietro/common';
import { GenericFilterDto } from '@pietro/common';
import { PostDto } from './dto/post.dto';
import { PostReponsesDto } from './dto/posts-response.dto';
import { PostReponseDto } from './dto/post-response.dto';

@Injectable()
export class BlogService extends PaginationService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Post) private readonly postRepository: Repository<Post>
    ) {
        super()
    }

    async createPost(userId: number, body: PostDto): Promise<PostReponseDto> {
        const user = await this.userRepository.findOne({ where: { id: userId } })
        const post = new Post();
        post.title = body.title;
        post.content = body.content;
        post.author = user;

        return await this.postRepository.save(post);
    }

    async updatePost(postId: number, body: PostDto) {
        const post = await this.postRepository.findOne({ where: { id: postId } })

        const newPost = {
            ...post,
            ...body,
        }

        return await this.postRepository.save(newPost);
    }

    async findAllPosts(filter: GenericFilterDto): Promise<PostReponsesDto> {
        const where = this.createWhereQuery(filter);
        return await this.paginate(this.postRepository, filter, where);
    }

    async findOnePost(postId: number): Promise<PostReponseDto> {
        const post = await this.postRepository.findOne({ where: { id: postId } });

        if (!post) {
            throw new BadRequestException();
        }

        return post;
    }

    async removePost(postId: number) {
        return await this.postRepository.delete({ id: postId });
    }
}
