import {
  Controller,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
} from '@nestjs/swagger';
import { ExternalService } from './external.services';


@ApiTags('external')
@Controller('external')
export class ExternalController {
  constructor(private readonly externalService: ExternalService) {}

  @Post('acccount/info')
  async getAccountInfo(){

  }

  @Post('publicKey')
  async getPublicKey(){

  }

  @Post('transfer')
  async transfer(){

  }
}
