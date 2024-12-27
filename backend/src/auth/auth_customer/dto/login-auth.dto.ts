import { IsNotEmpty, IsOptional } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty({ message: 'Empty username !!!' })
  username: string;

  @IsNotEmpty({ message: 'Empty password !!!' })
  password: string;
}
