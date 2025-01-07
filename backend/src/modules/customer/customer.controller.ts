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
  ApiParam,
} from '@nestjs/swagger';
import { SearchCustomerDto } from './dto/search-customer.dto';
import { AxiosService } from '@/axios/axios.service';
import { externalCustomerDto } from './dto/external-customer.dto';

@ApiBearerAuth()
@ApiTags('customer')
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly axiosService: AxiosService,
  ) {}

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

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: 200,
    description: 'Return all customers.',
    type: [SearchCustomerDto],
  })
  async findAll() {
    return this.customerService.findAll();
  }

  @ApiOperation({ summary: 'Search customer infomation with id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the customer',
    example: '675babee10466a57086768eb',
  })
  @ApiResponse({
    status: 200,
    description: 'Return customer by id.',
    type: SearchCustomerDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SearchCustomerDto> {
    return this.customerService.findOne(id);
  }

  @ApiOperation({
    summary: 'Search external customer infomation with accountNumber',
  })
  @ApiParam({
    name: 'accountNumber',
    type: String,
    description: 'The accountNumber of the external customer',
    example: '41083885711510355544',
  })
  @ApiResponse({
    status: 200,
    description: 'Return external customer by accountNumber.',
    type: SearchCustomerDto,
  })
  @Post('/external-search')
  async findExternalCustomer(@Body() body: any): Promise<any> {
    return await this.axiosService.getCustomerCredential(body.accountNumber);
  }

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
