import { forwardRef, Module } from '@nestjs/common';
import { MongoModule } from '@/databases/mongo.module';
import { ExternalController } from './external.controller';
import { ExternalService } from './external.services';
import { PgpModule } from '@/services/pgp/pgp.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [MongoModule, PgpModule, forwardRef(() => TransactionModule)],
  controllers: [ExternalController],
  providers: [ExternalService],
  exports: [ExternalService],
})
export class ExternalModule {}
