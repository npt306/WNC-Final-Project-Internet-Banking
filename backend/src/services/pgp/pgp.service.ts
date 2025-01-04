import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as openpgp from 'openpgp';
import * as crypto from 'crypto';

@Injectable()
export class PgpService {
  private username: string;
  private email: string;
  private privateKey: string;
  private publicKey: string;
  private passphrase: string;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.username = configService.get<string>("SECRET_USERNAME");
    this.email = configService.get<string>("SECRET_EMAIL");
    this.passphrase = configService.get<string>("SECRET_PASSPHRASE");

    this.generateKey()
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

  async generateKey() {
    const { privateKey, publicKey } = await openpgp.generateKey({
        type: 'rsa', // RSA keys
        rsaBits: 2048, // Key size
        userIDs: [{ name: this.username, email: this.email }],
        // keyExpirationTime: secreteExpiration,
        passphrase: this.passphrase, // Optional
      });
    
      return { publicKey, privateKey };
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

  async sign(data: string) {
    const privateKey = await openpgp.readPrivateKey({
      armoredKey: this.privateKey,
    });
    const signed = await openpgp.sign({
      message: await openpgp.createMessage({ text: data }),
      signingKeys: privateKey,
    });
    return signed;
  }

  async verify(data: string) {
    const publicKey = await openpgp.readKey({ armoredKey: this.publicKey });
    const verificationResult = await openpgp.verify({
      message: await openpgp.readMessage({ armoredMessage: data }),
      verificationKeys: publicKey,
    });
    const { verified, keyID } = verificationResult.signatures[0];
    try {
      await verified; // throws on invalid signature
      return true;
      console.log('Signed by key id ' + keyID.toHex());
    } catch {
      return false;
    }
  }

  generateSignature(encrypted: string, salt: number) {
    return crypto
      .createHash('md5')
      .update(JSON.stringify({ data: encrypted }) + salt)
      .digest('hex');
  }

  checkSignature(message: string, signature: string, salt: number) {
    const recalculatedSignature = crypto
        .createHash('md5')
        .update(JSON.stringify({ data: message }) + salt)
        .digest('hex');
    if(recalculatedSignature !== signature) {
      return false;
    }else {
      return true;
    }
  }
}
