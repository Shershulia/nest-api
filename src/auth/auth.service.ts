import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
@Injectable({})
export class AuthService {
  constructor(private prismaService: PrismaService,
              private jwt: JwtService,
              private config: ConfigService) { }

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

        return this.signToken(user.id, user.email);
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


    return this.signToken(user.id, user.email);

  }
  async signToken(userId: number, email: string) : Promise<{access_token:string}> {
    const payload = { sub: userId, email };
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: this.config.get('JWT_SECRET'),
    })
    return {
      access_token
    };

  }
}
