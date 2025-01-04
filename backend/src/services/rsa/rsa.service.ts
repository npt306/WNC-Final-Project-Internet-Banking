import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as openpgp from 'openpgp';
import * as crypto from 'crypto';
import { createSign, createVerify, generateKeyPairSync, privateDecrypt, publicEncrypt } from 'crypto';

@Injectable()
export class RsaService {
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
    // Generate the key pair
    const { publicKey, privateKey } = await generateKeyPairSync('rsa', {
      modulusLength: 2048, // Key size in bits
      publicKeyEncoding: {
        type: 'spki', // Public key format
        format: 'pem', // PEM encoded
      },
      privateKeyEncoding: {
        type: 'pkcs8', // Private key format
        format: 'pem', // PEM encoded
      },
    });

    return { publicKey, privateKey };
  }

  async encrypt(data: string, publicKey: string): Promise<string> {
    try {
      // Encrypt the data using the provided public key
      const encryptedBuffer = publicEncrypt(publicKey, Buffer.from(data, 'utf8'));
  
      // Convert the encrypted buffer to a base64-encoded string
      return encryptedBuffer.toString('base64');
    } catch (error) {
      console.error('Error encrypting data with RSA:', error);
      throw error;
    }
  }

  async decrypt(encryptedData: string): Promise<string> {
    try {
      // Convert the encrypted base64 data back to a Buffer
      const encryptedBuffer = Buffer.from(encryptedData, 'base64');
  
      // Decrypt the data using the private key and passphrase
      const decryptedBuffer = privateDecrypt(
        {
          key: this.privateKey,
          passphrase: this.passphrase, // The passphrase for decrypting the private key if necessary
        },
        encryptedBuffer
      );
  
      // Return the decrypted data as a UTF-8 string
      return decryptedBuffer.toString('utf8');
    } catch (error) {
      console.error('Error decrypting data with RSA:', error);
      throw error;
    }
  }

  async sign(data: string) {
    try {
      // Create a signer object using RSA-SHA256
      const sign = createSign('RSA-SHA256');
  
      // Update the signer with the data to be signed
      sign.update(data);
      sign.end();
  
      // Sign the data using the private key
      const signature = sign.sign(this.privateKey, 'base64url'); // Returns a base64-encoded signature

      return signature;
    } catch (error) {
      console.error('Error signing data with RSA:', error);
      throw error;
    }
  }

  async verify(data: string, signature: string) {
    try {
      // Create a verifier object using RSA-SHA256
      const verify = createVerify('RSA-SHA256');
  
      // Update the verifier with the data to be verified
      verify.update(data);
      verify.end();
  
      // Verify the signature using the public key
      const isValid = verify.verify(this.publicKey, signature, 'base64url'); // Expecting signature in base64
  
      return isValid;
    } catch (error) {
      console.error('Error verifying data with RSA:', error);
      return false;
    }
  }

  generateSignature(payload: string, salt: string) {
    return crypto
      .createHash('md5')
      .update(payload  + salt)
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
