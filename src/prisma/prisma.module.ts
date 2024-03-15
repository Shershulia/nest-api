import { Global, Module } from "@nestjs/common";
import { PrismaService } from './prisma.service';
//available for every module
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
