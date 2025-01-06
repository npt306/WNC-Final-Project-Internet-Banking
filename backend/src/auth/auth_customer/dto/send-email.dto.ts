import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SendEmailCustomerDto {
    @ApiProperty({
        example: 'nguyenvana',
        description: 'Username',
        required: true,
    })
    @IsNotEmpty({message: "Empty username !!!"})
    username: string;

    @ApiProperty({
        example: 'nguyenvana@gmail.com',
        description: 'Email',
        required: true,
    })
    @IsNotEmpty({message: "Empty email !!!"})
    email: string;
}
