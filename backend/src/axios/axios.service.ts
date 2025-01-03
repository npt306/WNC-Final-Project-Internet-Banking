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
    private externalBankPublicKey: string;
    private externalSalt: number;

    constructor(
    private readonly configService: ConfigService,
    private readonly pgpService: PgpService) {
        this.baseUrl = configService.get("EXTERNAL_BASE_URL");
        this.externalSalt = configService.get<number>("SECRET_SALT");
    }
    
    getPublicKey() {
        return this.externalBankPublicKey;
    }

    getExternalSalt() {
        return this.externalSalt;
    }

    async fetchPublicKey() {
        axios.get(this.baseUrl + '/external/publickey')
        .then((res) => {
            this.externalBankPublicKey = res.data.data;
            console.log(this.externalBankPublicKey)
        })
        .catch((error) => console.log(error))
    }

    async getCustomerCredential(accountNumber: string) {
        // const msg = '73336867059848144273';
        this.fetchPublicKey();
        const encrypted = this.pgpService.encrypt(accountNumber, this.externalBankPublicKey);
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
    }

    async postTransferMoney(transferDto: TransferDto) {
        // Encrypt message
        // const msg = {
        //     fromAccountNumber: '123123123123123',
        //     toAccountNumber: '73336867059848144273',
        //     amount: 100000,
        //     description: 'Gửi chơi chơi',
        // };
        this.fetchPublicKey();
        const encrypted = this.pgpService.encrypt(JSON.stringify(transferDto), this.externalBankPublicKey);
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
                Signature: crypto
                .createHash('md5')
                .update(JSON.stringify({ data: encrypted }) + this.externalSalt)
                .digest('hex'),
            },
            },
        );
        console.log(res.data);
    }
}
