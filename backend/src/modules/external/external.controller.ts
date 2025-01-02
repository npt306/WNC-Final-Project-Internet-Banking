import { ConfigService } from '@nestjs/config';
import {
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
} from '@nestjs/swagger';
import { ExternalService } from './external.services';
import { IpWhitelistGuard } from '@/guards/ip_whitelist/ip_whitelist.guard';
import { PgpService } from '@/services/pgp/pgp.service';

@ApiTags('external')
@Controller('external')
export class ExternalController {
  constructor(
    private readonly configService:ConfigService,
    private readonly externalService: ExternalService,
    private readonly pgpService: PgpService) {}

  @UseGuards(IpWhitelistGuard)
  @Post('acccount/info')
  async getAccountInfo(){
    return 'Access granted!';
  }

  @UseGuards(IpWhitelistGuard)
  @Get('publicKey')
  async getPublicKey(){
    return this.pgpService.getPublicKey();
  }

  @Post('transfer')
  async transfer(){
    
  }
}
