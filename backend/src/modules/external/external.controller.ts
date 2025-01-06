import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Response,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExternalService } from './external.services';
import { IpWhitelistGuard } from '@/guards/ip_whitelist/ip_whitelist.guard';
import { PgpService } from '@/services/pgp/pgp.service';
import { checkTimeDiff } from '@/helpers/utils';
import { AxiosService } from '@/axios/axios.service';
import { RsaService } from '@/services/rsa/rsa.service';
import { SearchExternalDto } from './dto/search-external.dto';
import { Response as Res } from 'express';
import { ExternalTransferDto } from './dto/external-transfer.dto';

@ApiTags('external')
@Controller('external')
export class ExternalController {
  constructor(
    private readonly configService: ConfigService,
    private readonly externalService: ExternalService,
    private readonly pgpService: PgpService,
    private readonly rsaService: RsaService,
    private readonly axiosService: AxiosService,
  ) {}

  @ApiOperation({ summary: 'For external bank: Get customer account info' })
  @ApiResponse({
    status: 200,
    description: 'Return customer account info'
  })
  @ApiBody({
    description: 'The decrypted account number of the customer',
    schema: {
      type: 'object',
      properties: {
        accountNumber: { type: 'string', example: '112233445566' },
      },
    },
  })
  @ApiCreatedResponse({
    example: {
      statusCode: 201,
      message: '',
      data: {
        _id: '675babee10466a57086768eb',
        username: 'nguyenvana',
        full_name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0901234567',
      },
    },
  })
  @UseGuards(IpWhitelistGuard)
  @Post('account/info')
  async getAccountInfo(
    @Headers('RequestDate') requestDate: number,
    @Headers('Signature') signature: string,
    @Headers('X-Signature') xSignature: string,
    @Body() body: SearchExternalDto,
    @Response({ passthrough: true }) res: Res,
  ) {
    if (!requestDate || !signature) {
      throw new BadRequestException('Missing required headers');
    }
    const requestTimestamp = Number(requestDate);
    if (isNaN(requestTimestamp)) {
      throw new BadRequestException('Invalid RequestDate');
    }

    const checkTime = checkTimeDiff(requestTimestamp);
    const checkSign = this.pgpService.checkSignature(
      JSON.stringify(body),
      signature,
      this.axiosService.getSecretSalt(),
    );
    if (!checkTime) {
      throw new BadRequestException(
        'RequestDate is outside the acceptable range',
      );
    }
    if (!checkSign) {
      throw new BadRequestException('Invalid Signature');
    }
    const decodeXSign = Buffer.from(xSignature, 'base64').toString('ascii');
    await this.axiosService.fetchPublicKey();
    const result = await this.pgpService.verify(
      JSON.stringify(body),
      decodeXSign,
      this.axiosService.getExternalBankPublicKey(),
    );

    if (!result) {
      throw new BadRequestException('Invalid X-Signature');
    }

    const foundCustomer = await this.externalService.handleAccountInfo(
      body.accountNumber,
    );
    res.header(
      'X-Signature',
      await this.rsaService.sign(JSON.stringify(foundCustomer)),
    );
    return foundCustomer;
  }

  @ApiOperation({ summary: 'For external bank: Get public key' })
  @ApiResponse({
    status: 200,
    description: 'Return public key'
  })
  @UseGuards(IpWhitelistGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({
    example: {
      statusCode: 200,
      message: '',
      data: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nSAMPLE PUBLIC KEY\n-----END PGP PUBLIC KEY BLOCK-----\n',
    },
  })
  @Get('publicKey')
  async getPublicKey() {
    return this.rsaService.getPublicKey();
  }

  @ApiOperation({ summary: 'For external bank: Post money transaction' })
  @ApiResponse({
    status: 200,
    description: 'Return transaction info'
  })
  @UseGuards(IpWhitelistGuard)
  @ApiBody({
    type: ExternalTransferDto,
    description: 'Json structure for transfer transaction creation',
  })
  @ApiCreatedResponse({
    description: 'Return status code of result',
    example: { message: 'success' },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('transfer')
  async transfer(
    // @Headers('RequestDate') requestDate: number,
    // @Headers('Signature') signature: string,
    // @Headers('X-Signature') xSignature: string,
    @Body() transferDto: ExternalTransferDto,
    @Response({ passthrough: true }) res: Res,
  ) {
    let result = await this.externalService.handleTransfer(transferDto);
    console.log(result);
    let msg = { message: 'success' };
    // TODO: optimize this logic
    const rsa = await this.axiosService.getRsa();
    const xSignature = await rsa.sign(JSON.stringify(msg));
    const externalSalt = this.axiosService.getExternalSalt();
    const signature = await rsa.generateSignature(
      JSON.stringify(msg),
      externalSalt,
    );
    const requestDate = new Date().getTime();
    res.setHeader('RequestDate', requestDate);
    res.setHeader('Signature', signature);
    res.setHeader('X-Signature', xSignature);
    return res.json(msg);

    // NEW TRANSFER HANDLE
    // if (!requestDate || !signature) {
    //   throw new BadRequestException('Missing required headers');
    // }
    // const requestTimestamp = Number(requestDate);
    // if (isNaN(requestTimestamp)) {
    //   throw new BadRequestException('Invalid RequestDate');
    // }

    // const checkTime = checkTimeDiff(requestTimestamp);
    // const checkSign = this.pgpService.checkSignature(
    //   JSON.stringify(transferDto),
    //   signature,
    //   this.axiosService.getSecretSalt(),
    // );
    // if (!checkTime) {
    //   throw new BadRequestException(
    //     'RequestDate is outside the acceptable range',
    //   );
    // }
    // if (!checkSign) {
    //   throw new BadRequestException('Invalid Signature');
    // }
    // const decodeXSign = Buffer.from(xSignature, 'base64').toString('ascii');
    // await this.axiosService.fetchPublicKey();
    // const result = await this.pgpService.verify(
    //   JSON.stringify(transferDto),
    //   decodeXSign,
    //   this.axiosService.getExternalBankPublicKey(),
    // );

    // if (!result) {
    //   throw new BadRequestException('Invalid X-Signature');
    // }

    // const transferResult = await this.externalService.handleTransfer(transferDto);
    // let msg = {"message": "success"};
    // const timeNow = new Date().getTime();
    // res.setHeader('RequestDate', timeNow)
    // res.setHeader('Signature',
    //   await this.rsaService.generateSignature(JSON.stringify(msg), this.axiosService.getExternalSalt()))
    // res.setHeader('X-Signature', await this.rsaService.sign(JSON.stringify(msg)))
    // return res.json(msg);
  }
}
