export class UpdateTransactionDto {
  amount?: number;
  type?: "INCOME" | "EXPENSE";
  category?: string;
  description?: string;
  transactionDate?: string; // ISO date string
}
