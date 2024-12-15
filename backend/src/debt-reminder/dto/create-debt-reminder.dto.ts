export class CreateDebtReminderDto {
    creditor: string;
    debtor: string;
    amount: number;
    message: string;
    createdAt: Date;
    status: string;
}
