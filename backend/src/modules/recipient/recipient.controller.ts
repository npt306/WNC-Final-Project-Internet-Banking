import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecipientService } from './recipient.service';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { UpdateRecipientDto } from './dto/update-recipient.dto';
import { Recipient } from './entities/recipient.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('recipient')
@Controller('recipient')
export class RecipientController {
  constructor(private readonly recipientService: RecipientService) {}

  @ApiOperation({ summary: '1.3: Create a recipient' })
  @ApiResponse({
    status: 201,
    description: 'The recipient has been successfully created.',
    type: Recipient,
  })
  @ApiBody({
    type: CreateRecipientDto,
    description: 'Json structure for recipient creation',
    examples: {
      withNickname: {
        value: {
          customer_id: '675db7c4cb2b0bf8ef4ffbf3',
          account_number: '112233445566',
          nickname: 'Uncle John',
          bank: 'default',
        },
      },
      withoutNickname: {
        value: {
          customer_id: '675db7c4cb2b0bf8ef4ffbf3',
          account_number: '112233445566',
          bank: 'default',
        },
      },
    },
  })
  @Post()
  async create(
    @Body() createRecipientDto: CreateRecipientDto,
  ): Promise<Recipient> {
    return this.recipientService.create(createRecipientDto);
  }

  // @Get()
  // async findAll(): Promise<Recipient[]> {
  //   return await this.recipientService.findAll();
  // }

  @ApiOperation({ summary: '1.3: Get list recipient by id' })
  @ApiResponse({
    status: 200,
    description: 'Return recipient by id.',
    type: [Recipient],
  })
  @Get(':id')
  async findCustomerRecipient(@Param('id') id: string): Promise<Recipient[]> {
    return this.recipientService.findCustomerRecipient(id);
  }

  @ApiOperation({ summary: '1.3 Update a recipient' })
  @ApiResponse({
    status: 200,
    description: 'Return updated recipient.',
    type: Recipient,
  })
  @ApiBody({
    type: CreateRecipientDto,
    description: 'Json structure for recipient update',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRecipientDto: UpdateRecipientDto,
  ): Promise<Recipient> {
    return this.recipientService.update(id, updateRecipientDto);
  }

  @ApiOperation({ summary: '1.3 Delete a recipient' })
  @ApiResponse({
    status: 200,
    description: 'Return deleted recipient.',
    type: Recipient,
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Recipient> {
    return this.recipientService.remove(id);
  }
}
