import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @ApiOperation({ summary: '4: Create employee' })
  @ApiResponse({
    status: 201,
    description: 'The employee has been successfully created.',
    type: Employee,
  })
  @ApiBody({
    type: CreateEmployeeDto,
    description: 'Json structure for employee creation',
  })
  @Post()
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    const newEmployee =
      await this.employeeService.createEmployee(createEmployeeDto);
    return newEmployee;
  }

  @ApiOperation({ summary: '4: Get all employees' })
  @ApiResponse({
    status: 200,
    description: 'Return all employees.',
    type: [Employee],
  })
  @Get()
  async findAll(): Promise<Employee[]> {
    const employees = await this.employeeService.findAll();
    return employees;
  }

  @ApiOperation({ summary: '4: Get employee by id' })
  @ApiResponse({
    status: 200,
    description: 'Return employee by id.',
    type: Employee,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Employee> {
    const findEmployee = await this.employeeService.findOne(id);
    return findEmployee;
  }

  @ApiOperation({ summary: '4: Update employee' })
  @ApiResponse({
    status: 200,
    description: 'Return updated employee.',
    type: Employee,
  })
  @ApiBody({
    type: UpdateEmployeeDto,
    description: 'Json structure for employee update',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @ApiOperation({ summary: '4: Delete employee' })
  @ApiResponse({
    status: 200,
    description: 'Return deleted employee.',
    type: Employee,
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.remove(id);
  }
}
