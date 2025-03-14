import { TransactionType } from "@/constants/transaction-type.enum";

export const TransferExample = {
  statusCode: 201,
  message: '',
  data: {
    sender: '556677889900',
    receiver: '112233445566',
    sender_bank: 'SankComBa',
    receiver_bank: 'Test Bank',
    amount: 100000,
    fee: 2000,
    content: 'Interbank Transfer money',
    sender_balance: 7498000,
    receiver_balance: 432000,
    payer: '112233445566',
    timestamp: '2024-12-28T17:57:22.124Z',
    type: TransactionType.TRANSFER,
    _id: '67703c0246c40ffcefd94108',
  },
};

export const DepositExample = {
  statusCode: 201,
  message: '',
  data: {
    receiver: '112233445566',
    amount: 100000,
    content: 'Deposit from bank',
    receiver_balance: 440000,
    timestamp: '2024-12-28T16:53:15.418Z',
    type: TransactionType.DEPOSIT,
    _id: '67702cfba58833cd162ea900',
    sender: null,
    sender_bank: null,
    receiver_bank: null,
    sender_balance: null,
    payer: null,
  },
};

export const DebtBodyExample = {
  sender: '556677889900',
  receiver: '112233445566',
  amount: 100000,
  content: 'Pay debt',
  payer: '112233445566',
  type: TransactionType.DEBT,
};

export const LocalTransferBodyExample = {
  sender: '556677889900',
  receiver: '112233445566',
  amount: 100000,
  content: 'Local transfer money',
  payer: '112233445566',
  type: TransactionType.TRANSFER,
};

export const InterbankTransferBodyExample = {
  "sender": "556677889900",
  "receiver": "73336867059848144273",
  "sender_bank": "SankComBa",
  "receiver_bank": "BlueSkyBank",
  "amount": 100000,
  "payer": "556677889900",
  "content": "Interbank transfer money",
  "type": "TRANSFER"
};
