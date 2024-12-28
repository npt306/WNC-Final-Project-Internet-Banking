import { IsOptional } from 'class-validator';

export interface TransactionDto {
  sender?: string | null;
  receiver: string;
  sender_bank?: string | null;
  receiver_bank?: string | null;
  amount: number;
  content: string;
  sender_balance?: number | null;
  receiver_balance: number | null;
  payer?: string | null;
  timestamp: Date;
  type: string;
}
