import { Module, forwardRef } from '@nestjs/common';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountController } from './account.controller';
import { CustomerModule } from 'src/modules/customer/customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    forwardRef(() => CustomerModule),
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
