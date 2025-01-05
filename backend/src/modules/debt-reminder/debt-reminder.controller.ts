import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DebtReminderService } from './debt-reminder.service';
import { CreateDebtReminderDto } from './dto/create-debt-reminder.dto';
import { UpdateDebtReminderDto } from './dto/update-debt-reminder.dto';
import { DebtReminder } from './entities/debt-reminder.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

// @ApiBearerAuth()
@ApiTags('debt-reminder')
@Controller('debt-reminder')
export class DebtReminderController {
  constructor(private readonly debtReminderService: DebtReminderService) {}

  @Post()
  @ApiOperation({ summary: '1.5.1: Create a debt reminder' })
  @ApiResponse({
    status: 201,
    description: 'The debt reminder has been successfully created.',
    type: DebtReminder,
  })
  @ApiBody({
    type: CreateDebtReminderDto,
    description: 'Json structure for debt reminder creation',
    examples: {
      example1: {
        value: {
          creditor: '675babee10466a57086768eb',
          debtor: '675babee10466a57086768ec',
          amount: 10000000,
          message: 'You owe me money',
          status: 'Pending',
        },
      },
    },
  })
  async create(@Body() createDebtReminderDto: CreateDebtReminderDto) {
    return await this.debtReminderService.create(createDebtReminderDto);
  }

  // @Get()
  // async findAll(): Promise<DebtReminder[]> {
  //   return this.debtReminderService.findAll();
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.debtReminderService.findOne(id);
  // }

  @ApiOperation({
    summary: '1.5.2: Get list debt reminder created by customer',
  })
  @ApiResponse({
    status: 200,
    description: 'Return debt reminder by id.',
    type: [DebtReminder],
  })
  @Get('/send/:id')
  async findSendDebtReminder(@Param('id') id: string) {
    return await this.debtReminderService.findSendDebtReminder(id);
  }

  @ApiOperation({
    summary: '1.5.2: Get list debt reminder assigned by customer',
  })
  @ApiResponse({
    status: 200,
    description: 'Return debt reminder by id.',
    type: [DebtReminder],
  })
  @Get('/received/:id')
  async findReceivedDebtReminder(@Param('id') id: string) {
    return await this.debtReminderService.findReceivedDebtReminder(id);
  }

  // @ApiOperation({ summary: '1.5.3: Update a debt reminder' })
  // @ApiResponse({ status: 200, description: 'Return updated debt reminder.', type: DebtReminder })
  // @ApiBody({
  //   type: UpdateDebtReminderDto,
  //   description: 'Json structure for debt reminder update',
  // })
  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateDebtReminderDto: UpdateDebtReminderDto,
  // ): Promise<DebtReminder> {
  //   return this.debtReminderService.update(id, updateDebtReminderDto);
  // }

  @ApiOperation({ summary: '1.5.3: Cancelled  a debt reminder' })
  @ApiResponse({
    status: 200,
    description: 'Return updated debt reminder.',
    type: DebtReminder,
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DebtReminder> {
    return await this.debtReminderService.remove(id);
  }

  @ApiOperation({ summary: '*1.5.4: Pay a debt reminder' })
  @ApiResponse({
    status: 200,
    description: 'Return updated debt reminder.',
    type: DebtReminder,
  })
  @Get('/pay/:id')
  async payDebtReminder(@Param('id') id: string) {
    return await this.debtReminderService.payDebt(id);
  }
}
