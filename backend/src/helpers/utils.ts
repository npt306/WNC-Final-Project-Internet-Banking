const bcryptjs = require('bcryptjs');
const argon2 = require('argon2');
import * as crypto from 'crypto';
import * as openpgp from 'openpgp';

const saltRounds = 10;
const secretPassphrase = process.env.SECRET_PASSPHRASE;
const secreteUsername = "Internet banking app Team 08";
const secreteEmail = "internet.banking.system.bot@gmail.com";
const timeDiff = 300000; //5 minutes

export const hashPasswordHelper = async (plainPassword: string) => {
  try {
    return await bcryptjs.hash(plainPassword, saltRounds);
    // return plainPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparePasswordHelper = async (
  plainPassword: string,
  hashPassword: string,
) => {
  try {
    return await bcryptjs.compare(plainPassword, hashPassword);
    // const hashPassword = bcryptjs.hash(plainPassword, saltRounds);
    // return plainPassword === hashPassword;
  } catch (error) {
    console.log(error);
  }
};

export const compareRefreshToken = async (token: string, receivedToken: string) => {
    try {
        return await argon2.verify(
            receivedToken,
            token,
          );
    }catch (error) {
        // console.log(error);
    }
}

export const randomSequence = (length: number) => {
    if (length <= 0) {
        return "";      
    }
    
    let result = '';
    for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10); 
    }

    return result;
}

export async function generatePGPKeys() {
  const { privateKey, publicKey } = await openpgp.generateKey({
    type: 'rsa', // RSA keys
    rsaBits: 2048, // Key size
    userIDs: [{ name: secreteUsername, email: secreteEmail }],
    // keyExpirationTime: secreteExpiration,
    passphrase: secretPassphrase, // Optional
  });

  return { publicKey, privateKey };
}

export function generateSignature(encrypted: Promise<string>, salt: number) {
  return crypto
    .createHash('md5')
    .update(JSON.stringify({ data: encrypted }) + salt)
    .digest('hex');
}

export function checkTimeDiff(requestTimestamp: number) {
  const currentTime = Date.now();
  const timeDifference = Math.abs(currentTime - requestTimestamp);

  // Allow a maximum difference of 5 minutes (300,000 milliseconds)
  if (timeDifference > timeDiff) {
    return false;
  }else {
    return true;
  }
}

export function checkSignature(message: string, signature: string, salt: number) {
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