import { PgpService } from '@/services/pgp/pgp.service';
import { Customer } from './../modules/customer/entities/customer.entity';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { TransferDto } from '@/modules/transaction/dto/transfer.dto';

@Injectable()
export class AxiosService {
    private baseUrl: string;
    private salt: number;
    private externalBankPublicKey: string;

    constructor(
    private readonly configService: ConfigService,
    private readonly pgpService: PgpService,
    private readonly httpService: HttpService) {
        this.baseUrl = configService.get("EXTERNAL_BASE_URL");
        this.salt = configService.get<number>("SECRET_SALT");

        axios.get(this.baseUrl + '/api/external/publickey')
        .then((res) => {
            this.externalBankPublicKey = res.data.data;
        })
    }
    async getPublicKey() {
        return this.externalBankPublicKey;
    }

    async getCustomerCredential(accountNumber: string) {
        // const msg = '73336867059848144273';
        const encrypted = this.pgpService.encrypt(accountNumber, this.externalBankPublicKey);
        // Send encrypted message
        const res = await axios.post(
            this.baseUrl + '/api/external/account/info',
            {
                data: encrypted,
            },
            {
            headers: {
                RequestDate: new Date().getTime(),
                Signature: crypto
                .createHash('md5')
                .update(JSON.stringify({ data: encrypted }) + this.salt)
                .digest('hex'),
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
        const encrypted = this.pgpService.encrypt(JSON.stringify(transferDto), this.externalBankPublicKey);
        console.log(encrypted);
        // Send encrypted message
        const res = await axios.post(
            this.baseUrl + '/api/external/transfer',
            {
                data: encrypted,
            },
            {
            headers: {
                RequestDate: new Date().getTime(),
                Signature: crypto
                .createHash('md5')
                .update(JSON.stringify({ data: encrypted }) + this.salt)
                .digest('hex'),
            },
            },
        );
        console.log(res.data);
    }
}
