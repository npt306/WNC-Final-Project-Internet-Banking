import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({ summary: '2.1: Create customer' })
  @ApiResponse({
    status: 201,
    description: 'The customer has been successfully created.',
  })
  @ApiBody({
    description: 'Json structure for customer creation',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'john_doe' },
        full_name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'johndoe@example.com' },
        phone: { type: 'string', example: '08012345678' },
        password: { type: 'string', example: '123456' },
        refresh_token: { type: 'string', example: 'none' },
      },
    },
  })
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createCustomer(createCustomerDto);
  }

  // @Get()
  // findAll() {
  //   return this.customerService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.customerService.findOne(id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCustomerDto: UpdateCustomerDto,
  // ) {
  //   return this.customerService.update(id, updateCustomerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.customerService.remove(id);
  // }
}
