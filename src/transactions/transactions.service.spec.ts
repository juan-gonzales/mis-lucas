import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { TransactionsService } from "./transactions.service";
import { Transaction } from "./entities/transaction.entity";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { User } from "../users/entities/user.entity";

describe("TransactionsService", () => {
  let service: TransactionsService;
  let repo: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsService],
    })
      .overrideProvider(TransactionsService)
      .useValue(
        new TransactionsService(repo as unknown as Repository<Transaction>),
      )
      .compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it("creates a transaction", async () => {
    const dto: CreateTransactionDto = {
      amount: 10,
      type: "INCOME",
      category: "Salary",
      transactionDate: "2024-01-01",
    };
    const created: Transaction = {
      id: "1",
      userId: 1,
      amount: dto.amount,
      type: dto.type,
      category: dto.category,
      transactionDate: dto.transactionDate,
      description: dto.description,
      // The relation is not needed for this test
      user: undefined as unknown as User,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    repo.create.mockReturnValue(created);
    repo.save.mockResolvedValue(created);

    const result = await service.create(1, dto);

    expect(repo.create).toHaveBeenCalledWith({ ...dto, userId: 1 });
    expect(repo.save).toHaveBeenCalledWith(created);
    expect(result).toBe(created);
  });

  it("throws when transaction not found", async () => {
    repo.findOne.mockResolvedValue(undefined);
    await expect(service.findOne("bad", 1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
