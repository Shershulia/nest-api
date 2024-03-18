import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class EditBookmarkDto {
  @IsString()
  @IsOptional()
  title?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsOptional()
  link?: string;
}