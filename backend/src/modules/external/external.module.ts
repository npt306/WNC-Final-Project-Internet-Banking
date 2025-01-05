import { forwardRef, Module } from '@nestjs/common';
import { MongoModule } from '@/databases/mongo.module';
import { ExternalController } from './external.controller';
import { ExternalService } from './external.services';
import { PgpModule } from '@/services/pgp/pgp.module';
import { TransactionModule } from '../transaction/transaction.module';
import { AccountModule } from '../account/account.module';
import { RsaModule } from '@/services/rsa/rsa.module';
import { AxiosModule } from '@/axios/axios.module';

@Module({
  imports: [
    MongoModule,
    PgpModule,
    RsaModule,
    AxiosModule,
    forwardRef(() => TransactionModule),
    forwardRef(() => AccountModule),
  ],
  controllers: [ExternalController],
  providers: [ExternalService],
  exports: [ExternalService],
})
export class ExternalModule {}
