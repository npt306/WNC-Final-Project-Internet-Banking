import { forwardRef, Inject, Injectable, ValidationPipe } from '@nestjs/common';
import * as openpgp from 'openpgp';
import { TransactionService } from '../transaction/transaction.services';
import { AccountService } from '../account/account.service';
import { PgpService } from '@/services/pgp/pgp.service';
import { AxiosService } from '@/axios/axios.service';
import { plainToClass } from 'class-transformer';
import { ExternalTransferDto } from './dto/external-transfer.dto';
import { TransferLogDto } from '../transaction/dto/transfer_log.dto';

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
      TransferLogDto,
      {
        amount: externalTransferDto.amount,
        content: externalTransferDto.description,
        sender: externalTransferDto.fromAccountNumber,
        receiver: externalTransferDto.toAccountNumber,
        type: 'TRANSFER',
      },
      { exposeDefaultValues: true },
    );

    return await this.transactionService.externalTransfer(transferDto);
  }
}
