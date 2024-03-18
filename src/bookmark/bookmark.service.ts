import { ForbiddenException, Injectable } from "@nestjs/common";
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";
@Injectable()
export class BookmarkService {
  constructor(private prismaService: PrismaService  ) {
  }
  async getBookmarks(userId: number) {
    return await this.prismaService.bookmark.findMany({
      where: {
        userId,
      }
    });
  }


  getBookmarkById(userId: number, bookmarkId: number) {
    return this.prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      }
    });

  }
  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    return await this.prismaService.bookmark.create({
      data: {
        userId,
        ...dto,
      }
    });
  };

  async editBookmarkById(userId: number,bookmarkId: number ,dto: EditBookmarkDto) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      }
    });
    if(bookmark.userId !== userId || !bookmark) {
      throw new ForbiddenException('Access to this resource is forbidden');
    }

    return await this.prismaService.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: dto,
    });
  }
  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      }
    });
    if(bookmark.userId !== userId || !bookmark) {
      throw new ForbiddenException('Access to this resource is forbidden');
    }

    await this.prismaService.bookmark.delete({
      where: {
        id: bookmarkId,
      }
    });

  }
}
