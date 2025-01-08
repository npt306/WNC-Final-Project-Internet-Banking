import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DebtReminderNotificationService } from './debt-reminder-notification.service';
import { CreateDebtReminderNotificationDto } from './dto/create-debt-reminder-notification.dto';
import { UpdateDebtReminderNotificationDto } from './dto/update-debt-reminder-notification.dto';
import { DebtReminderNotification } from './entities/debt-reminder-notification.entity';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AssignRoles } from '@/decorator/assign-role';
import { Roles } from '@/constants/roles.enum';
import { JwtAccessGuard } from '@/jwt/guards/jwt-access.guard';
import { RolesGuard } from '@/jwt/guards/role.guard';

@ApiBearerAuth('JWT-auth')
@AssignRoles(Roles.ADMIN)
@AssignRoles(Roles.EMPLOYEE)
@AssignRoles(Roles.CUSTOMER)
@UseGuards(JwtAccessGuard, RolesGuard)

@ApiTags('Debt Reminder Notifications')
@Controller('debt-reminder-notification')
export class DebtReminderNotificationController {
  constructor(private readonly service: DebtReminderNotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create new notification' })
  @ApiResponse({ status: 201, type: DebtReminderNotification })
  create(@Body() createDto: CreateDebtReminderNotificationDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({ status: 200, type: [DebtReminderNotification] })
  findAll() {
    return this.service.findAll();
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get customer notifications' })
  @ApiResponse({ status: 200, type: [DebtReminderNotification] })
  getCustomerNotifications(@Param('customerId') customerId: string) {
    return this.service.getCustomerNotifications(customerId);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, type: DebtReminderNotification })
  markAsRead(@Param('id') id: string) {
    return this.service.markAsRead(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
