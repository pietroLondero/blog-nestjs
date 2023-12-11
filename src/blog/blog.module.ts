import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule, User } from '@pietro/auth';
import { Post, PostCategory } from './entities';
import { AuthService } from '@pietro/auth';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostCategory, User])],
  providers: [JwtService, AuthService, BlogService],
  exports: [BlogService],
  controllers: [BlogController],
})
export class BlogModule { }
