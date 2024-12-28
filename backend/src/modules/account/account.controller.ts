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
import { transferExample, depositExample } from './schema/account.schema';

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
  @ApiCreatedResponse({ example: depositExample })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('deposit')
  async deposit(@Body() depositDto: DepositDto): Promise<any> {
    return await this.accountService.deposit(depositDto);
  }

  @ApiBody({
    type: TransferDto,
    description: 'Json structure for transfer transaction creation',
  })
  @ApiCreatedResponse({ example: transferExample })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('transfer')
  async transfer(@Body() transferDto: TransferDto): Promise<any> {
    return await this.accountService.transfer(transferDto);
  }
}
