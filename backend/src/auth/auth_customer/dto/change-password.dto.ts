import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty({
        example: 'nguyenvana',
        description: 'Username of customer',
        required: true,
    })
    @IsNotEmpty({message: "Empty username !!!"})
    username: string;

    @ApiProperty({
        example: '963258',
        description: 'OTP code for confirm password change',
        required: true,
    })
    @IsNotEmpty({message: "Empty change password OTP code !!!"})
    code: string;

    @ApiProperty({
        example: 'newpassword',
        description: 'New password',
        required: true,
    })
    @IsNotEmpty({message: "Empty password !!!"})
    password: string;

    @ApiProperty({
        example: 'newpassword',
        description: 'Double-check password',
        required: true,
    })
    @IsNotEmpty({message: "Empty confirm password !!!"})
    confirm_password: string;
}
