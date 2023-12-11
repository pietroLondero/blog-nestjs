import { Expose, Type } from 'class-transformer';
import { AuthorResponseDto } from './author.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PostReponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  content: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @Type(() => AuthorResponseDto)
  @ApiProperty()
  author: AuthorResponseDto
}
