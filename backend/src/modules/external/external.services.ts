import { forwardRef, Inject, Injectable, ValidationPipe } from '@nestjs/common';
import * as openpgp from 'openpgp';
import { TransactionService } from '../transaction/transaction.services';
import { AccountService } from '../account/account.service';
import { PgpService } from '@/services/pgp/pgp.service';
import { AxiosService } from '@/axios/axios.service';
import { plainToClass } from 'class-transformer';
import { ExternalTransferDto } from './dto/external-transfer.dto';
import { TransferDto } from '../transaction/dto/transfer.dto';
import { SupportedBank } from '../transaction/dto/transaction.dto';

@Injectable()
export class ExternalService {
  constructor(
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,

    private readonly pgpService: PgpService,
    private readonly axiosService: AxiosService,
  ) {}

  async handleAccountInfo(accountNumber: string) {
    return await this.accountService.findCustomerByAccountNumber(accountNumber);
  }

  async handleTransfer(externalTransferDto: ExternalTransferDto) {

    const transferDto = plainToClass(
      TransferDto,
      {
        amount: externalTransferDto.amount,
        content: externalTransferDto.description,
        sender: externalTransferDto.fromAccountNumber,
        receiver: externalTransferDto.toAccountNumber,
        sender_bank: SupportedBank.BlueSkyBank,
        receiver_bank: SupportedBank.ThisBank,
        payer: (externalTransferDto.feePayer == "SENDER")? externalTransferDto.fromAccountNumber : externalTransferDto.toAccountNumber, 
        type: 'TRANSFER',
      },
      { exposeDefaultValues: true },
    );

    return await this.transactionService.externalTransfer(transferDto);
  }
}
