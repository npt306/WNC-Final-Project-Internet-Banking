import {
  Controller,
  Get,
  Param,
  Delete,
  Patch,
  Body,
  Post,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create-account.dto';
import { Customer } from '../customer/entities/customer.entity';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@ApiTags('account')
@ApiBearerAuth()
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // @Post()
  // async create(@Body() createAccountDto: CreateAccountDto) {
  //   return await this.accountService.createAccount(createAccountDto);
  // }

  @ApiResponse({ status: 200, description: 'Return all accounts.' })
  @ApiResponse({ status: 500, description: 'Internal' })
  @ApiOperation({ summary: 'Get all accounts' })
  @Get('all')
  async findAll(): Promise<any> {
    return await this.accountService.findAll();
  }

  @ApiOperation({ summary: '1.2: List customer accounts with id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the account',
    example: '675babee10466a57086768ed',
  })
  @ApiResponse({
    status: 200,
    description: 'Return account by id.',
    type: [Account],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':id')
  async findAccountsUser(@Param('id') id: string): Promise<Account[]> {
    return await this.accountService.findAccountsUser(id);
  }

  @ApiOperation({
    summary: '1.4: Get customer information with account number',
  })
  @ApiParam({
    name: 'accountNumber',
    type: String,
    description: 'The account number of the customer',
    example: '112233445566',
  })
  @ApiResponse({
    status: 200,
    description: 'Return customer username and full by account number.',
  })
  @Get('/customer-information/:accountNumber')
  async findOne(
    @Param('accountNumber') accountNumber: string,
  ): Promise<Customer> {
    return await this.accountService.findCustomerByAccountNumber(accountNumber);
  }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto): Promise<Account> {
  //   return await this.accountService.updateUserAccount(id, updateAccountDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Account> {
    return await this.accountService.removeAccount(id);
  }

  @Post('balance')
  @ApiOperation({ summary: 'Update account balance' })
  @ApiResponse({
    status: 200,
    description: 'The balance has been successfully updated.',
    type: Account,
  })
  @ApiBody({
    type: UpdateBalanceDto,
    description: 'Update balance data',
    examples: {
      example1: {
        value: {
          account_number: '112233445566',
          balance: 1000000,
        },
      },
    },
  })
  async updateBalance(
    @Body() updateBalanceDto: UpdateBalanceDto,
  ): Promise<Account> {
    return await this.accountService.updateBalance(updateBalanceDto);
  }
}
