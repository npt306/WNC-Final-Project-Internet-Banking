import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // @Post()
  // async create(@Body() createAccountDto: CreateAccountDto) {
  //   return await this.accountService.createAccount(createAccountDto);
  // }

  @Get()
  async findAll(): Promise<Account[]> {
    return await this.accountService.findAll();
  }

  // @Get(':id')
  // async findAccountsUser(@Param('id') id: string): Promise<Account[]> {
  //   return await this.accountService.findAccountsUser(id);
  // }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto): Promise<Account> {
  //   return await this.accountService.updateUserAccount(id, updateAccountDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Account> {
    return await this.accountService.removeAccount(id);
  }

  @Post('deposit')
  async deposit(@Body() body: any): Promise<any> {
    return await this.accountService.deposit(body.id, body.amount);
  }

  @Post('transfer')
  async transfer(@Body() body: any): Promise<any> {
    return await this.accountService.transfer(
      body.sender_id,
      body.receiver_id,
      body.amount,
    );
  }
}
