import { Module, forwardRef } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { MongoModule } from '../../databases/mongo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { AccountModule } from 'src/modules/account/account.module';
import { AxiosService } from '@/axios/axios.service';
import { PgpService } from '@/services/pgp/pgp.service';
import { RsaService } from '@/services/rsa/rsa.service';
import { RsaModule } from '@/services/rsa/rsa.module';
import { PgpModule } from '@/services/pgp/pgp.module';
import { AxiosModule } from '@/axios/axios.module';

@Module({
  imports: [
    MongoModule,
    RsaModule,
    PgpModule,
    AxiosModule,
    TypeOrmModule.forFeature([Customer]),
    forwardRef(() => AccountModule),
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
