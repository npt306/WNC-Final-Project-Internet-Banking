import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY_CUSTOMER = 'isPublicCustomer';
export const PublicRouteCustomer = () => SetMetadata(IS_PUBLIC_KEY_CUSTOMER, true);