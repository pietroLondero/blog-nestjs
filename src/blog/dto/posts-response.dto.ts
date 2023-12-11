import { Expose, Transform, Type } from 'class-transformer';
import { PostReponseDto } from './post-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@pietro/common';

export class PostReponsesDto extends BaseResponseDto {
    @Expose()
    @Type(() => PostReponseDto)
    @ApiProperty()
    data: PostReponseDto[];
}
