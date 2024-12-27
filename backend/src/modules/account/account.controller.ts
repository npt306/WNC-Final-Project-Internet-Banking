import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create-account.dto';
import { ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

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
