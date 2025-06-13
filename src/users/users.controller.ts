import {
  Controller,
  Delete,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtUser } from "../auth/jwt-user.interface";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  async getMe(@Req() req: Request & { user: JwtUser }) {
    return this.usersService.findById(req.user.userId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch("me")
  async updateMe(
    @Req() req: Request & { user: JwtUser },
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.userId, dto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("me")
  async deleteMe(@Req() req: Request & { user: JwtUser }) {
    await this.usersService.remove(req.user.userId);
    return { deleted: true };
  }
}
