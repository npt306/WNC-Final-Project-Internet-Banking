import { ConfigService } from '@nestjs/config';
import { BadRequestException, Body, Controller, Get, Headers, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExternalService } from './external.services';
import { IpWhitelistGuard } from '@/guards/ip_whitelist/ip_whitelist.guard';
import { PgpService } from '@/services/pgp/pgp.service';
import { InterbankTransferBodyExample } from '../transaction/schema/transaction.schema';
import { ExternalTransferDto } from '../transaction/dto/external_transfer.dto';
import { checkSignature, checkTimeDiff } from '@/helpers/utils';
import { AxiosService } from '@/axios/axios.service';

@ApiTags('external')
@Controller('external')
export class ExternalController {
  constructor(
    private readonly configService: ConfigService,
    private readonly externalService: ExternalService,
    private readonly pgpService: PgpService,
    private readonly axiosService: AxiosService
  ) {}

  @UseGuards(IpWhitelistGuard)
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
      "statusCode": 201,
      "message": "",
      "data": {
        "_id": "675babee10466a57086768eb",
        "username": "nguyenvana",
        "full_name": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "phone": "0901234567"
      }
    }
  })
  @Post('acccount/info')
  async getAccountInfo(
    @Headers('RequestDate') requestDate: number,
    @Headers('Signature') signature: string,
    @Body() body: any) {
    // var accountNumber = body.accountNumber;


    // if (!requestDate || !signature) {
    //   throw new BadRequestException('Missing required headers');
    // }
    const requestTimestamp = Number(requestDate);
    if (isNaN(requestTimestamp)) {
      throw new BadRequestException('Invalid RequestDate');
    }

    const checkTime = checkTimeDiff(requestTimestamp);
    const checkSign = checkSignature(body, signature, this.axiosService.getExternalSalt());
    // if(!checkTime) {
    //   throw new BadRequestException('RequestDate is outside the acceptable range');
    // }
    if(!checkSign) {
      throw new BadRequestException('Invalid Signature');
    }

    const accountNumber = await this.pgpService.decrypt(body);

    return this.externalService.handleAccountInfo(accountNumber);
    // return 'Access granted!';
  }

  @UseGuards(IpWhitelistGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('publicKey')
  async getPublicKey() {
    return this.pgpService.getPublicKey();
  }

  @UseGuards(IpWhitelistGuard)
  @ApiBody({
    type: ExternalTransferDto,
    description: 'Json structure for transfer transaction creation',
    examples: {
      example: {
        summary: 'Interbank Transfer type transaction example',
        value: InterbankTransferBodyExample,
      },
    },
  })
  @ApiCreatedResponse({ 
    description: "Return status code of result",
    example: {
      statusCode: 201,
      message: '',
    }
  })
  @Post('transfer')
  async transfer(@Body() transferDto: ExternalTransferDto) {
    return this.externalService.handleTransfer(transferDto);
  }
}
