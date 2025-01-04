import { Module } from '@nestjs/common';
import { RsaService } from './rsa.service';

@Module({
    imports: [],
  controllers: [],
  providers: [RsaService],
  exports: [RsaService]
})
export class RsaModule {}