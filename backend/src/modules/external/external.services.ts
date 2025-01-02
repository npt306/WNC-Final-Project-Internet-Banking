import { generatePGPKeys } from '@/helpers/utils';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as openpgp from 'openpgp';
import { TransactionService } from '../transaction/transaction.services';
import { ExternalTransferDto } from '../transaction/dto/external_transfer.dto';

@Injectable()
export class ExternalService {
  constructor(
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
  ) {}

  async createPublicKey() {
    return await generatePGPKeys();
  }

  async encrypt(data: string, publicKey: string): Promise<string> {
    const publicKeyObj = await openpgp.readKey({ armoredKey: publicKey });
    return await openpgp.encrypt({
      message: await openpgp.createMessage({ text: data }),
      encryptionKeys: publicKeyObj,
    });
  }

  async decrypt(
    encryptedData: string,
    privateKey: string,
    passphrase: string,
  ): Promise<string> {
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

  async handleTransfer(externalTransferDto: ExternalTransferDto) {
    return await this.transactionService.externalTransfer(externalTransferDto);
  }
}
