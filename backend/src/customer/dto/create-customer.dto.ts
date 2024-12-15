export class CreateCustomerDto {
    username: string;
    full_name: string;
    email: string;
    phone: string;
    password: string;
    refresh_token?: string | null;
}
