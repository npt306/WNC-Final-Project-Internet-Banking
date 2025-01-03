import { generatePGPKeys } from '@/helpers/utils';
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

  async createPublicKey() {
    return await generatePGPKeys();
  }

  async encrypt(data: string): Promise<string> {
    const publicKey = this.pgpService.getPublicKey();
    const publicKeyObj = await openpgp.readKey({ armoredKey: publicKey });
    return await openpgp.encrypt({
      message: await openpgp.createMessage({ text: data }),
      encryptionKeys: publicKeyObj,
    });
  }

  async decrypt(
    encryptedData: string,
    passphrase: string,
  ): Promise<string> {
    const privateKey = this.pgpService.getPrivateKey();
    const privateKeyObj = await openpgp.readPrivateKey({
      armoredKey: privateKey,
    });
    const decryptedPrivateKey = await openpgp.decryptKey({
      privateKey: privateKeyObj,
      passphrase,
    });

    const message = await openpgp.readMessage({
      armoredMessage: encryptedData,
    });
    const { data: decryptedData } = await openpgp.decrypt({
      message,
      decryptionKeys: decryptedPrivateKey,
    });

    return decryptedData;
  }

  async handleAccountInfo(accountNumber: string) {
    let result = await this.accountService.findCustomerByAccountNumber(accountNumber);
    const encrypted = this.pgpService.encrypt(accountNumber, this.axiosService.getExternalBankPublicKey());
    
    return result;
  }

  async handleTransfer(externalTransferDto: ExternalTransferDto) {
    return await this.transactionService.externalTransfer(externalTransferDto);
  }
}
