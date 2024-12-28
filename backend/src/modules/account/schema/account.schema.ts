export const transferExample = {
  statusCode: 201,
  message: '',
  data: {
    sender: '675db7c4cb2b0bf8ef4ffbf3',
    receiver: '675db7c4cb2b0bf8ef4ffbf6',
    sender_bank: 'bank A',
    receiver_bank: 'bank B',
    amount: 100000,
    content: 'Transfer money',
    sender_balance: 240000,
    receiver_balance: 7500000,
    timestamp: '2024-12-28T10:08:22.418Z',
    type: 'TRANSFER',
    _id: '676fce16af0fcbcd031cd2ad',
    payer: null,
  },
};

export const depositExample = {
  statusCode: 201,
  message: '',
  data: {
    receiver: '675db7c4cb2b0bf8ef4ffbf3',
    amount: 100000,
    content: 'Deposit from bank',
    receiver_balance: 340000,
    timestamp: '2024-12-28T10:18:49.980Z',
    type: 'DEPOSIT',
    _id: '676fd08a40822c0ea2f22448',
    sender: null,
    sender_bank: null,
    receiver_bank: null,
    sender_balance: null,
    payer: null,
  },
};
