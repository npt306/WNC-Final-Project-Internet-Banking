import { Module, forwardRef } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { MongoModule } from '../../databases/mongo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { AccountModule } from 'src/modules/account/account.module';
import { AxiosService } from '@/axios/axios.service';
import { PgpService } from '@/services/pgp/pgp.service';

@Module({
  imports: [
    MongoModule,
    TypeOrmModule.forFeature([Customer]),
    forwardRef(() => AccountModule),
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    PgpService,
    AxiosService
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
