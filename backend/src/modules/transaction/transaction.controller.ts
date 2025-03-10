import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TransactionService } from './transaction.services';
import {
  DebtBodyExample,
  DepositExample,
  InterbankTransferBodyExample,
  LocalTransferBodyExample,
  TransferExample,
} from './schema/transaction.schema';
import { TransferDto } from './dto/transfer.dto';
import { DepositDto } from './dto/deposit.dto';
import { TransferLogDto } from './dto/transfer_log.dto';
import { CheckTransferOTPDto } from './dto/check-otp.dto';
import { AssignRoles } from '@/decorator/assign-role';
import { Roles } from '@/constants/roles.enum';
import { JwtAccessGuard } from '@/jwt/guards/jwt-access.guard';
import { RolesGuard } from '@/jwt/guards/role.guard';

@ApiBearerAuth('JWT-auth')
@AssignRoles(Roles.ADMIN)
@AssignRoles(Roles.EMPLOYEE)
@AssignRoles(Roles.CUSTOMER)
@UseGuards(JwtAccessGuard, RolesGuard)

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: 'Get all transactions with other banks' })
  @ApiResponse({ status: 200, description: 'Return transactions.' })
  @ApiQuery({
    name: 'from',
    type: Date,
    required: false,
    description: 'Start date of the chosen period',
    example: '2024-12-28',
  })
  @ApiQuery({
    name: 'to',
    type: Date,
    required: false,
    description: 'End date of the chosen period',
    example: '2024-12-29',
  })
  @ApiQuery({
    name: 'bank',
    type: String,
    required: false,

    description: 'Name of the chosen bank',
    example: 'bank A',
  })
  @Get('checking')
  async findForChecking(
    @Query('bank') bank?: string,
    @Query('from') from?: Date,
    @Query('to') to?: Date,
  ): Promise<{ transactions: Transaction[]; totalAmount: number }> {
    if (!(from && to)) {
      throw new BadRequestException(
        "Must declare both 'from' and 'to' query for period querying",
      );
    }
    return await this.transactionService.getListForChecking(bank, from, to);
  }

  @ApiOperation({ summary: 'Get all transactions with all banks' })
  @ApiResponse({ status: 200, description: 'Return transactions.' })
  @ApiQuery({
    name: 'from',
    type: Date,
    required: false,
    description: 'Start date of the chosen period',
    example: '2024-12-28',
  })
  @ApiQuery({
    name: 'to',
    type: Date,
    required: false,
    description: 'End date of the chosen period',
    example: '2024-12-29',
  })
  @Get('checking-all')
  async findAllForChecking(
    @Query('from') from?: Date,
    @Query('to') to?: Date,
  ): Promise<{ transactions: Transaction[]; totalAmount: number }> {
    if (!(from && to)) {
      throw new BadRequestException(
        "Must declare both 'from' and 'to' query for period querying",
      );
    }
    return await this.transactionService.getListForCheckingAllBanks(from, to);
  }

  @ApiOperation({ summary: 'Deposit money to an account' })
  @ApiBody({
    type: DepositDto,
    description: 'Json structure for deposit transaction creation',
  })
  @ApiCreatedResponse({ example: DepositExample })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('deposit')
  async deposit(@Body() depositDto: DepositDto): Promise<any> {
    return await this.transactionService.deposit(depositDto);
  }

  @ApiOperation({ summary: 'Transfer money from an acount to another' })
  @ApiBody({
    type: TransferDto,
    description: 'Json structure for transfer transaction creation',
    examples: {
      example1: {
        summary: 'Local Transfer type transaction example',
        value: LocalTransferBodyExample,
      },
      example2: {
        summary: 'Debt type transaction example',
        value: DebtBodyExample,
      },
      example3: {
        summary: 'Interbank Transfer type transaction example',
        value: InterbankTransferBodyExample,
      },
    },
  })
  @ApiCreatedResponse({ example: TransferExample })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('transfer')
  async transfer(@Body() transferDto: TransferDto): Promise<any> {
    if (transferDto.sender_bank && transferDto.receiver_bank){
      if (transferDto.sender_bank !== transferDto.receiver_bank){
        return await this.transactionService.externalTransfer(transferDto);
      }
    }
    return await this.transactionService.transfer(transferDto);
  }

  @ApiOperation({ summary: 'Get the transaction history of an account' })
  @ApiParam({
    name: 'accountNumber',
    type: String,
    description: 'The account number of the customer',
    example: '112233445566',
  })
  @Get('transfer/history/:accountNumber')
  async transferHistory(
    @Param('accountNumber') accountNumber: string,
  ): Promise<any> {
    return await this.transactionService.getList(accountNumber);
  }

  @ApiParam({
    name: 'accountNumber',
    type: String,
    description: 'The account number of the customer',
    example: '112233445566',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all transaction of an accoutn',
    type: [Transaction],
  })
  @ApiOperation({ summary: '1.6: Get all transaction history of an account' })
  @Get('all-transaction-history/:accountNumber')
  async allTransactionHistory(
    @Param('accountNumber') accountNumber: string,
  ): Promise<any> {
    return await this.transactionService.allTransactionHistory(accountNumber);
  }

  @ApiParam({
    name: 'accountNumber',
    type: String,
    description: 'The account number of the customer',
    example: '112233445566',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all transfer transaction of an accoutn',
    type: [Transaction],
  })
  @ApiOperation({
    summary: '1,6: Get the transfer transaction history of an account',
  })
  @Get('transfer-transaction-history/:accountNumber')
  async transferTransactionHistory(
    @Param('accountNumber') accountNumber: string,
  ): Promise<any> {
    return await this.transactionService.transferTransactionHistory(
      accountNumber,
    );
  }

  @ApiParam({
    name: 'accountNumber',
    type: String,
    description: 'The account number of the customer',
    example: '112233445566',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all receiver transaction of an accoutn',
    type: [Transaction],
  })
  @ApiOperation({
    summary: '1.6: Get the receiver transaction history of an account',
  })
  @Get('receiver-transaction-history/:accountNumber')
  async receiverTransactionHistory(
    @Param('accountNumber') accountNumber: string,
  ): Promise<any> {
    return await this.transactionService.receiverTransactionHistory(
      accountNumber,
    );
  }

  @ApiParam({
    name: 'accountNumber',
    type: String,
    description: 'The account number of the customer',
    example: '112233445566',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all debt payment transaction of an accoutn',
    type: [Transaction],
  })
  @ApiOperation({
    summary: '1.6: Get the debt payment transaction history of an account',
  })
  @Get('debt-payment-transaction-history/:accountNumber')
  async debtPaymentTransactionHistory(
    @Param('accountNumber') accountNumber: string,
  ): Promise<any> {
    return await this.transactionService.debtPaymentTransactionHistory(
      accountNumber,
    );
  }

  @ApiOperation({ summary: 'Check transfer OTP' })
  @ApiResponse({
    status: 200,
    description: 'Return true/false as result of checking OTP',
    type: Boolean,
  })
  @Post('/check-otp')
  async checkTransferOTP(@Body() checkTransferOTPDto: CheckTransferOTPDto) {
    return {
      checkOTP: await this.transactionService.checkTransferOTP(checkTransferOTPDto)
    }
  }

  @ApiOperation({ summary: 'Send OTP to sender email' })
  @ApiResponse({
    status: 200,
    description: 'Return sender _id',
    type: String,
  })
  @ApiParam({
    name: 'id',
    description: 'The _id of sender',
    example: '67703c0246c40ffcefd94108',
  })
  @Get('/transfer-otp/:id')
  async sendTransferOTP(@Param('id') id: string) {
    return await this.transactionService.sendTransferEmail(id);
  }
}
