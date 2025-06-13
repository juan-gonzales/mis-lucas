import { Test, TestingModule } from "@nestjs/testing";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { JwtUser } from "../auth/jwt-user.interface";
import { Request } from "express";

describe("TransactionsController", () => {
  let controller: TransactionsController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [TransactionsService],
    })
      .overrideProvider(TransactionsService)
      .useValue(service)
      .compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it("should delegate creation to service", async () => {
    const dto: CreateTransactionDto = {
      amount: 5,
      type: "INCOME",
      category: "Gift",
      transactionDate: "2024-01-01",
    };
    const req = { user: { userId: 1 } as JwtUser } as Request & {
      user: JwtUser;
    };
    service.create.mockResolvedValue({ id: "1" });

    const result = await controller.create(req, dto);

    expect(service.create).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual({ id: "1" });
  });
});
