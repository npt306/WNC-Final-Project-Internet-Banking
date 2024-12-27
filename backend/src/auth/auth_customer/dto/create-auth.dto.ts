import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'Empty username !!!' })
  username: string;

  @IsNotEmpty({ message: 'Empty fullname !!!' })
  full_name: string;

  @IsNotEmpty({ message: 'Empty email !!!' })
  email: string;

  @IsNotEmpty({ message: 'Empty phone number !!!' })
  phone: string;

  @IsNotEmpty({ message: 'Empty password !!!' })
  password: string;

  @IsOptional()
  refresh_token?: string | null;
}
