import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecipientService } from './recipient.service';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { UpdateRecipientDto } from './dto/update-recipient.dto';
import { Recipient } from './entities/recipient.entity';

@Controller('recipient')
export class RecipientController {
  constructor(private readonly recipientService: RecipientService) {}

  @Post()
  async create(@Body() createRecipientDto: CreateRecipientDto): Promise<Recipient> {
    return this.recipientService.create(createRecipientDto);
  }

  @Get()
  async findAll(): Promise<Recipient[]> {
    return await this.recipientService.findAll();
  }

  @Get(':id')
  async findCustomerRecipient(@Param('id') id: string): Promise<Recipient[]> {
    return this.recipientService.findCustomerRecipient(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRecipientDto: UpdateRecipientDto): Promise<Recipient> {
    return this.recipientService.update(id, updateRecipientDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Recipient> {
    return this.recipientService.remove(id);
  }
}
