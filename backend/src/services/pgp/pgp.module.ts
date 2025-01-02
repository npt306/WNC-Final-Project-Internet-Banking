import { Module } from '@nestjs/common';
import { PgpService } from './pgp.service';

@Module({
    imports: [],
  controllers: [],
  providers: [PgpService],
  exports: [PgpService]
})
export class PgpModule {}