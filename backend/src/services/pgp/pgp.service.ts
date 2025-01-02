import { generatePGPKeys } from '@/helpers/utils';
import { Injectable } from '@nestjs/common';
import * as openpgp from 'openpgp';

@Injectable()
export class PgpService {
  private privateKey: string;
  private publicKey: string;
  constructor() {
    generatePGPKeys()
    .then(({ publicKey, privateKey }) => {
      this.privateKey = privateKey;
      this.publicKey = publicKey;
    })
  }
  getPublicKey() {
    return this.publicKey;
  }
  getPrivateKey() {
    return this.privateKey;
  }

  async encrypt(data: string): Promise<string> {
    const publicKeyObj = await openpgp.readKey({ armoredKey: this.publicKey });
    return await openpgp.encrypt({
      message: await openpgp.createMessage({ text: data }),
      encryptionKeys: publicKeyObj,
    });
  }

  async decrypt(encryptedData: string, passphrase: string): Promise<string> {
    const privateKeyObj = await openpgp.readPrivateKey({ armoredKey: this.privateKey });
    const decryptedPrivateKey = await openpgp.decryptKey({
      privateKey: privateKeyObj,
      passphrase,
    });

    const message = await openpgp.readMessage({ armoredMessage: encryptedData });
    const { data: decryptedData } = await openpgp.decrypt({
      message,
      decryptionKeys: decryptedPrivateKey,
    });

    return decryptedData;
  }
}
