import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { comparePasswordHelper, hashPasswordHelper } from '@/helpers/utils';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async findById(id: string) {
      return await this.employeeRepository.findOneBy({ _id: new ObjectId(id) });
    }
  
    async validateUser(username: string, pass: string) {
      const user = await this.employeeRepository.findOneBy({ username: username });
      if(!user) return null;
      const isValidPassword = await comparePasswordHelper(pass, user.password);
    
      if(!user || !isValidPassword) return null;
      return user;
    }

  async createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    if (await this.employeeRepository.findOneBy({ username: createEmployeeDto.username })) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await hashPasswordHelper(createEmployeeDto.password);

    const newEmployee = this.employeeRepository.create({
      ...createEmployeeDto,
      password: hashedPassword
    });

    const savedEmployee = await this.employeeRepository.save(newEmployee);
    
    return savedEmployee;
  }

  async findAll(): Promise<Employee[]> {
    return await this.employeeRepository.find();
  }

  async findOne(id: string): Promise<Employee> {
    const findEmployee = await this.employeeRepository.findOneBy({
      _id: new ObjectId(id),
    });
    if (!findEmployee) {
      throw new NotFoundException(`Employee not found`);
    }
    return findEmployee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    await this.findOne(id);
    await this.employeeRepository.update(
      { _id: new ObjectId(id) },
      updateEmployeeDto,
    );
    const updatedEmployee = await this.findOne(id);

    return updatedEmployee;
  }

  async remove(id: string): Promise<Employee> {
    const removedEmployee = await this.findOne(id);
    await this.employeeRepository.delete({ _id: new ObjectId(id) });
    return removedEmployee;
  }
}
