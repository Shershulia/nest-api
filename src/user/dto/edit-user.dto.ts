import { IsEmail, IsOptional, IsString } from "class-validator";

export default class EditUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  lastName?: string;
}