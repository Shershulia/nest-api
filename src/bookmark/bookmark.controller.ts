import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { BookmarkService } from "./bookmark.service";
import { GetUser } from "../auth/decorator";
import { User } from "@prisma/client";
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";


@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {
  }
  @Get()
  getBookmarks(@GetUser("id") userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(":id")
  getBookmarkById(@GetUser("id") userId: number,
                  @Param('id',ParseIntPipe) bookmarkId: number) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }
  //@Body is used to get the data from the request body
  @Post()
  createBookmark(@GetUser("id") userId: number,
                 @Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @Patch(":id")
  editBookmarkById(@GetUser("id") userId: number,
                   @Param('id',ParseIntPipe) bookmarkId: number,
                   @Body() dto: EditBookmarkDto) {
    return this.bookmarkService.editBookmarkById(userId, bookmarkId, dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  deleteBookmarkById(@GetUser("id") userId: number,
                     @Param('id',ParseIntPipe) bookmarkId: number) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }

}