import { IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty({message: "Empty username !!!"})
    username: string;

    @IsNotEmpty({message: "Empty change password code !!!"})
    code: string;

    @IsNotEmpty({message: "Empty password !!!"})
    password: string;

    @IsNotEmpty({message: "Empty confirm password !!!"})
    confirm_password: string;
}
