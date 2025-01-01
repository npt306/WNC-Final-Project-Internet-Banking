import { Module } from '@nestjs/common';
import { MongoModule } from '@/databases/mongo.module';
import { ExternalController } from './external.controller';
import { ExternalService } from './external.services';

@Module({
  imports: [
    MongoModule,
  ],
  controllers: [ExternalController],
  providers: [ExternalService],
  exports: [ExternalService],
})
export class ExternalModule {}
