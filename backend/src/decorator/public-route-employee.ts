import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY_EMPLOYEE = 'isPublicEmployee';
export const PublicRouteEmployee = () => SetMetadata(IS_PUBLIC_KEY_EMPLOYEE, true);