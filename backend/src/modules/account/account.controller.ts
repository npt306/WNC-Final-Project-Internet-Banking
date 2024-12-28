import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create-account.dto';
import { ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { TransferDto } from '../transaction/dto/transfer.dto';
import { DepositDto } from '../transaction/dto/deposit.dto';
import {
  LocalTransferBodyExample,
  InterbankTransferBodyExample,
  DebtBodyExample,
  DepositExample,
  TransferExample,
} from '../transaction/schema/transaction.schema';
import { Customer } from '../customer/entities/customer.entity';

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
  @Get()
  async findAll(): Promise<Account[]> {
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

  @ApiBody({
    type: DepositDto,
    description: 'Json structure for deposit transaction creation',
  })
  @ApiCreatedResponse({ example: DepositExample })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('deposit')
  async deposit(@Body() depositDto: DepositDto): Promise<any> {
    return await this.accountService.deposit(depositDto);
  }

  @ApiBody({
    type: TransferDto,
    description: 'Json structure for transfer transaction creation',
    examples: {
      example1: {
        summary: 'Local Transfer type transaction example',
        value: LocalTransferBodyExample,
      },
      example2: {
        summary: 'Interbank Transfer type transaction example',
        value: InterbankTransferBodyExample,
      },
      example3: {
        summary: 'Debt type transaction example',
        value: DebtBodyExample,
      },
    },
  })
  @ApiCreatedResponse({ example: TransferExample })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('transfer')
  async transfer(@Body() transferDto: TransferDto): Promise<any> {
    return await this.accountService.transfer(transferDto);
  }
}
