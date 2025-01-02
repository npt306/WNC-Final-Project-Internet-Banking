import { Module } from '@nestjs/common';
import { MongoModule } from '@/databases/mongo.module';
import { ExternalController } from './external.controller';
import { ExternalService } from './external.services';
import { PgpModule } from '@/services/pgp/pgp.module';

@Module({
  imports: [
    MongoModule,
    PgpModule
  ],
  controllers: [ExternalController],
  providers: [ExternalService],
  exports: [ExternalService],
})
export class ExternalModule {}
