import { PgpService } from '@/services/pgp/pgp.service';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { TransferDto } from '@/modules/transaction/dto/transfer.dto';
import { RsaService } from '@/services/rsa/rsa.service';

@Injectable()
export class AxiosService {
    private baseUrl: string;
    private externalSalt: string;
    private secretSalt: string;
    private externalBankPublicKey: string;

    constructor(
    private readonly configService: ConfigService,
    private readonly pgpService: PgpService,
    private readonly rsaService: RsaService) {
        this.baseUrl = configService.get("EXTERNAL_BASE_URL");
        this.secretSalt = configService.get<string>("SECRET_SALT");
        this.externalSalt = configService.get<string>("EXTERNAL_SALT");
        this.fetchPublicKey();
    }

    getExternalBankPublicKey() {
        return this.externalBankPublicKey;
    }

    getSecretSalt() {
        return this.secretSalt;
    }

    getExternalSalt() {
        return this.externalSalt;
    }

    async fetchPublicKey() {
        let res = await axios.get(this.baseUrl + '/external/publicKey');
        this.externalBankPublicKey = res.data.data;
    }

    async getCustomerCredential(accountNumber: string) {
        // const accountNumber = '112233445566';
        // Send encrypted message
        const payload = {
            accountNumber: accountNumber,
        };
        const xSignature = await this.rsaService.sign(JSON.stringify(payload));
        try {
            const res = await axios.post(
                this.baseUrl + '/external/account/info',
                payload,
                {
                    headers: {
                        RequestDate: new Date().getTime(),
                        Signature: this.rsaService.generateSignature(JSON.stringify(payload), this.externalSalt),
                        "X-Signature": xSignature
                    },
                },
            );
            const xSignatureReceive = res.headers["x-signature"];
            console.log(xSignatureReceive);

            const decodeXSign = Buffer.from(xSignatureReceive, 'base64').toString('ascii');
            await this.fetchPublicKey()
            const result = await this.pgpService.verify(JSON.stringify(res.data), decodeXSign, this.getExternalBankPublicKey());
            if(!result) {
                throw new BadRequestException('Invalid X-Signature');
            }
            return res.data;
        }catch(error) {
            console.log(error);
            throw new InternalServerErrorException("Cannot get required resources");
        }
        
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
                Signature: this.pgpService.generateSignature(encrypted, this.externalSalt),
            },
            },
        );
        console.log(res.data);
    }
}
