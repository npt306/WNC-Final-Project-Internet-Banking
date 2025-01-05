import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from './entities/admin.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Create admin' })
  @ApiResponse({
    status: 201,
    description: 'The admin has been successfully created.',
    type: Admin,
  })
  @ApiBody({
    type: CreateAdminDto,
    description: 'Json structure for admin creation',
  })
  @Post()
  async create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    const newAdmin = await this.adminService.createAdmin(createAdminDto);
    return newAdmin;
  }

  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({
    status: 200,
    description: 'Return all admins.',
    type: [Admin],
  })
  @Get()
  async findAll(): Promise<Admin[]> {
    const admins = await this.adminService.findAll();
    return admins;
  }

  @ApiOperation({ summary: 'Get admin by id' })
  @ApiResponse({
    status: 200,
    description: 'Return admin by id.',
    type: Admin,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Admin> {
    const findAdmin = await this.adminService.findOne(id);
    return findAdmin;
  }

  @ApiOperation({ summary: 'Update admin' })
  @ApiResponse({
    status: 200,
    description: 'Return updated admin.',
    type: Admin,
  })
  @ApiBody({
    type: CreateAdminDto,
    description: 'Json structure for admin update',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Admin>,
  ): Promise<Admin> {
    return this.adminService.update(id, updateData);
  }

  @ApiOperation({ summary: 'Delete admin' })
  @ApiResponse({
    status: 200,
    description: 'Return deleted admin.',
    type: Admin,
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Admin> {
    return this.adminService.remove(id);
  }
}
