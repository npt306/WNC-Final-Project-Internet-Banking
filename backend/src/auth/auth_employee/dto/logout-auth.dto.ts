import { IsNotEmpty, IsOptional } from 'class-validator';

export class LogoutAuthDto {
  @IsNotEmpty({ message: 'Empty username !!!' })
  username: string;

  @IsNotEmpty()
  refresh_token?: string | null;
}
