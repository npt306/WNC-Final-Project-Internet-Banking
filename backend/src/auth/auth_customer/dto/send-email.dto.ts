import { IsNotEmpty } from "class-validator";

export class SendEmailCustomerDto {
    @IsNotEmpty({message: "Empty username !!!"})
    username: string;

    @IsNotEmpty({message: "Empty email !!!"})
    email: string;
}
