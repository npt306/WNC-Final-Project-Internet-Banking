export const transferExample = {
  "statusCode": 201,
  "message": "",
  "data": {
    "sender": "112233445566",
    "receiver": "556677889900",
    "sender_bank": "bank A",
    "receiver_bank": "bank A",
    "amount": 100000,
    "fee": 2000,
    "content": "Transfer money",
    "sender_balance": 138000,
    "receiver_balance": 7798000,
    "payer": "112233445566",
    "_id": "67702f039d40d34dbb56b9eb"
  }
};

export const depositExample = {
  "statusCode": 201,
  "message": "",
  "data": {
    "receiver": "112233445566",
    "amount": 100000,
    "content": "Deposit from bank",
    "receiver_balance": 440000,
    "timestamp": "2024-12-28T16:53:15.418Z",
    "type": "DEPOSIT",
    "_id": "67702cfba58833cd162ea900",
    "sender": null,
    "sender_bank": null,
    "receiver_bank": null,
    "sender_balance": null,
    "payer": null
  }
};
