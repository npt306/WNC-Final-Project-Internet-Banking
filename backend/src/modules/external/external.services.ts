import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as openpgp from 'openpgp';
import { TransactionService } from '../transaction/transaction.services';
import { ExternalTransferDto } from '../transaction/dto/external_transfer.dto';
import { AccountService } from '../account/account.service';
import { PgpService } from '@/services/pgp/pgp.service';
import { AxiosService } from '@/axios/axios.service';

@Injectable()
export class ExternalService {
  constructor(
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,

    private readonly pgpService: PgpService,
    private readonly axiosService: AxiosService
  ) {}

  async handleAccountInfo(accountNumber: string) {
    return await this.accountService.findCustomerByAccountNumber(accountNumber);
  }

  async handleTransfer(externalTransferDto: ExternalTransferDto) {
    return await this.transactionService.externalTransfer(externalTransferDto);
  }
}
