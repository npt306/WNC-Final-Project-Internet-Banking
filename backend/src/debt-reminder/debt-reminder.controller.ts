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

@Controller('debt-reminder')
export class DebtReminderController {
  constructor(private readonly debtReminderService: DebtReminderService) {}

  @Post()
  async create(@Body() createDebtReminderDto: CreateDebtReminderDto) {
    return await this.debtReminderService.create(createDebtReminderDto);
  }

  @Get()
  async findAll(): Promise<DebtReminder[]> {
    return this.debtReminderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.debtReminderService.findOne(id);
  }

  @Get('/send/:id')
  async findSendDebtReminder(@Param('id') id: string) {
    return await this.debtReminderService.findSendDebtReminder(id);
  }
  @Get('/received/:id')
  async findReceivedDebtReminder(@Param('id') id: string) {
    return await this.debtReminderService.findReceivedDebtReminder(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDebtReminderDto: UpdateDebtReminderDto,
  ): Promise<DebtReminder> {
    return this.debtReminderService.update(id, updateDebtReminderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DebtReminder> {
    return await this.debtReminderService.remove(id);
  }
}
