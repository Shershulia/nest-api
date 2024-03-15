import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { Prisma } from "@prisma/client/extension";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
@Injectable({})
export class AuthService {
  constructor(private prismaService: PrismaService) { }
  login(){

    }
  async signup(dto: AuthDto) {
      //generate password hash
      const hash = await argon.hash(dto.password);
      try {
        //save the user in the db
        const user = await this.prismaService.user.create({
          data: {
            email: dto.email,
            hash,
          },
        });
        //
        delete user.hash;

        return user;
      }
      catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002')
            throw new ForbiddenException('Email already exists');
        }
        throw error;
      }

  }
  async signin(dto: AuthDto){
    //find the user in the db
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email
      }
    });

    if (!user) {
      throw new ForbiddenException('Credentials are not valid!');
    }

    //if the user is found, check the password
    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Credentials are not valid!');
    }

    //if the password is correct, return the user
    //if the password is incorrect, return an error
    delete user.hash;
    return user;

  }
}
