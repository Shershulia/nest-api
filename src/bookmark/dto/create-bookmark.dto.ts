import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class CreateBookmarkDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsNotEmpty()
  link: string;
}