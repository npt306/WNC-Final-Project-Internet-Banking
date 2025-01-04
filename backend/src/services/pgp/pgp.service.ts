import { generatePGPKeys } from '@/helpers/utils';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as openpgp from 'openpgp';

@Injectable()
export class PgpService {
  private privateKey: string;
  private publicKey: string;
  private passphrase: string;

  constructor(
    private readonly configService: ConfigService
  ) {
    generatePGPKeys()
    .then(({ publicKey, privateKey }) => {
      this.privateKey = privateKey;
      this.publicKey = publicKey;
      this.passphrase = configService.get<string>("SECRET_PASSPHRASE");
    })
  }
  getPublicKey() {
    return this.publicKey;
  }
  getPrivateKey() {
    return this.privateKey;
  }

  async encrypt(data: string, publicKey: string): Promise<string> {
    const publicKeyObj = await openpgp.readKey({ armoredKey: publicKey });
    return await openpgp.encrypt({
      message: await openpgp.createMessage({ text: data }),
      encryptionKeys: publicKeyObj,
    });
  }

  async decrypt(encryptedData: string): Promise<string> {
    const privateKeyObj = await openpgp.readPrivateKey({ armoredKey: this.privateKey });
    const decryptedPrivateKey = privateKeyObj.isDecrypted()
      ? privateKeyObj
      : await openpgp.decryptKey({
          privateKey: privateKeyObj,
          passphrase: this.passphrase,
        });
  
    const message = await openpgp.readMessage({ armoredMessage: encryptedData });
  
    const { data: decryptedData } = await openpgp.decrypt({
      message,
      decryptionKeys: decryptedPrivateKey,
    });
  
    return decryptedData;
  }
}
