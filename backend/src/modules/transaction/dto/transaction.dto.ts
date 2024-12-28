export enum TransactionType {
  TRANSFER = 'TRANSFER',
  DEBT = 'DEBT',
  DEPOSIT = 'DEPOSIT',
}

export interface TransactionDto {
  sender?: string | null;
  receiver: string;
  sender_bank?: string | null;
  receiver_bank?: string | null;
  amount: number;
  fee?: number;
  content: string;
  sender_balance?: number | null;
  receiver_balance: number | null;
  payer?: string | null;
  timestamp: Date;
  type: string;
}
