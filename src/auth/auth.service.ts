import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
@Injectable({})
export class AuthService {
  constructor(private PrismaService: PrismaService) { }
  login(){

    }
  signup(){
      return {msg: "I am signing up!"}
  }
  signin(){
    return {msg: "I am signing in!"}

  }
}
