import { PgpService } from '@/services/pgp/pgp.service';
import { Customer } from './../modules/customer/entities/customer.entity';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { TransferDto } from '@/modules/transaction/dto/transfer.dto';
import { generateSignature } from '@/helpers/utils';

@Injectable()
export class AxiosService {
    private baseUrl: string;
    private externalSalt: number;
    private externalBankPublicKey: string;

    constructor(
    private readonly configService: ConfigService,
    private readonly pgpService: PgpService) {
        this.baseUrl = configService.get("EXTERNAL_BASE_URL");
        this.externalSalt = configService.get<number>("SECRET_SALT");
    }

    getExternalBankPublicKey() {
        return this.externalBankPublicKey;
    }

    getExternalSalt() {
        return this.externalSalt;
    }

    async fetchPublicKey() {
        let res = await axios.get(this.baseUrl + '/external/publicKey');
        this.externalBankPublicKey = res.data.data;
    }

    async getCustomerCredential(accountNumber: string) {
        // const msg = '73336867059848144273';
        await this.fetchPublicKey();
        const encrypted = await this.pgpService.encrypt(accountNumber, this.externalBankPublicKey);
        // Send encrypted message
        const res = await axios.post(
            this.baseUrl + '/external/account/info',
            {
                data: encrypted,
            },
            {
                headers: {
                    RequestDate: new Date().getTime(),
                    Signature: generateSignature(encrypted, this.externalSalt)
                },
            },
        );
        console.log(res.data);
        return res;
    }

    async postTransferMoney(transferDto: TransferDto) {
        // Encrypt message
        // const msg = {
        //     fromAccountNumber: '123123123123123',
        //     toAccountNumber: '73336867059848144273',
        //     amount: 100000,
        //     description: 'Gửi chơi chơi',
        // };
        await this.fetchPublicKey();
        const encrypted = await this.pgpService.encrypt(JSON.stringify(transferDto), this.externalBankPublicKey);
        console.log(encrypted);
        // Send encrypted message
        const res = await axios.post(
            this.baseUrl + '/external/transfer',
            {
                data: encrypted,
            },
            {
            headers: {
                RequestDate: new Date().getTime(),
                Signature: generateSignature(encrypted, this.externalSalt),
            },
            },
        );
        console.log(res.data);
    }
}
