const bcryptjs = require('bcryptjs');
const argon2 = require('argon2');
import * as openpgp from 'openpgp';

const saltRounds = 10;
const secretPassphrase = "b96ea3a0-bc33-4dfd-aed1-9a76233afdc9";
const secreteUsername = "Internet banking app Team 08";
const secreteEmail = "internet.banking.system.bot@gmail.com";
const secreteExpiration = 600; //10 minutes

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