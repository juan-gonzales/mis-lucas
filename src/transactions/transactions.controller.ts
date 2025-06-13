import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { JwtUser } from "../auth/jwt-user.interface";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";

@Controller("transactions")
@UseGuards(AuthGuard("jwt"))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Req() req: Request & { user: JwtUser },
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(req.user.userId, dto);
  }

  @Get()
  findAll(
    @Req() req: Request & { user: JwtUser },
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("type") type?: "INCOME" | "EXPENSE",
  ) {
    return this.transactionsService.findAll(req.user.userId, {
      startDate,
      endDate,
      type,
    });
  }

  @Get(":id")
  findOne(@Req() req: Request & { user: JwtUser }, @Param("id") id: string) {
    return this.transactionsService.findOne(id, req.user.userId);
  }

  @Put(":id")
  update(
    @Req() req: Request & { user: JwtUser },
    @Param("id") id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, req.user.userId, dto);
  }

  @Delete(":id")
  remove(@Req() req: Request & { user: JwtUser }, @Param("id") id: string) {
    return this.transactionsService.remove(id, req.user.userId);
  }
}
