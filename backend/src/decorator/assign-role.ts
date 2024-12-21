import { Roles } from '@/constants/roles.enum';
import { SetMetadata } from '@nestjs/common';

export const AssignRoles = (...roles: Roles[]) => SetMetadata('roles', roles);
