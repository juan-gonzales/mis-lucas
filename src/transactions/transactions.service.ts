import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "./entities/transaction.entity";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";

export interface FindTransactionsFilter {
  startDate?: string;
  endDate?: string;
  type?: "INCOME" | "EXPENSE";
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}

  create(userId: number, dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionsRepository.create({
      ...dto,
      userId,
    });
    return this.transactionsRepository.save(transaction);
  }

  findAll(
    userId: number,
    filter: FindTransactionsFilter = {},
  ): Promise<Transaction[]> {
    const where: Record<string, unknown> = { userId };
    if (filter.type) {
      where.type = filter.type;
    }
    if (filter.startDate && filter.endDate) {
      where.transactionDate = { $gte: filter.startDate, $lte: filter.endDate };
    } else if (filter.startDate) {
      where.transactionDate = { $gte: filter.startDate };
    } else if (filter.endDate) {
      where.transactionDate = { $lte: filter.endDate };
    }
    return this.transactionsRepository.find({
      where,
      order: { transactionDate: "DESC" },
    });
  }

  async findOne(id: string, userId: number): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, userId },
    });
    if (!transaction) throw new NotFoundException("Transaction not found");
    return transaction;
  }

  async update(
    id: string,
    userId: number,
    dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id, userId);
    Object.assign(transaction, dto);
    return this.transactionsRepository.save(transaction);
  }

  async remove(id: string, userId: number): Promise<void> {
    await this.findOne(id, userId);
    await this.transactionsRepository.delete(id);
  }
}
