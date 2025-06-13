import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

export type TransactionType = "INCOME" | "EXPENSE";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: number;

  @ManyToOne(() => User)
  user!: User;

  @Column("decimal")
  amount!: number;

  @Column()
  type!: TransactionType;

  @Column()
  category!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "date" })
  transactionDate!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
