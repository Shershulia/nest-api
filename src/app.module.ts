import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';

//Config inbuild module to store enviroment variables
import { ConfigModule } from "@nestjs/config";
@Module({
  imports: [AuthModule, UserModule, BookmarkModule, PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })],
})
export class AppModule {}
