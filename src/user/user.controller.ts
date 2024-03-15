import { Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtGuard } from "../auth/guard";
import { GetUser } from "../auth/decorator";
import { User } from "@prisma/client";
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get("me")
  //user stored as appended value in request
  getMe(@GetUser("id") user: User) {
    return user;
  }

  @Patch()
  editUser(@Req() req: Request) {

  }
}
