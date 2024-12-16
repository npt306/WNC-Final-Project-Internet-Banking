import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { ObjectId } from 'mongodb';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const newEmployee = await this.employeeService.create(createEmployeeDto);
    return newEmployee;
  }

  @Get()
  async findAll(): Promise<Employee[]> {
    const employees = await this.employeeService.findAll();
    return employees;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Employee> {
    const findEmployee = await this.employeeService.findOne(id);
    return findEmployee
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.remove(id);
  }
}
