import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsEnum, IsString, IsNotEmpty } from "class-validator";

export class PostDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public content: string;
}