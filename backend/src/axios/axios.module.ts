import { Module } from '@nestjs/common';
import { AxiosService } from './axios.service';
import { HttpModule } from '@nestjs/axios';
import { PgpModule } from '@/services/pgp/pgp.module';
import { ConfigService } from '@nestjs/config';
import { RsaModule } from '@/services/rsa/rsa.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000, // Set timeout (5 seconds)
      maxRedirects: 5, // Maximum number of redirects
    }),
    PgpModule,
    RsaModule
  ],
  controllers: [],
  providers: [ConfigService, AxiosService],
  exports: [AxiosService]
})
export class AxiosModule {}
