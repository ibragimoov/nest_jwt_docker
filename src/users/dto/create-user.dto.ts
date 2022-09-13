import { ApiProperty } from "@nestjs/swagger";
import { isEmail, IsString, Length } from "class-validator";
import { IsEmail } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: "user@mail.ru", description: "Эл. почта" })
    @IsString({ message: "Должно быть стокой" })
    @IsEmail({}, { message: "Некорректный имеил" })
    readonly email: string;

    @ApiProperty({ example: "123qwerty", description: "Пароль" })
    @IsString({ message: "Должно быть стокой" })
    @Length(4, 16, { message: "От 4 до 16 символов" })
    readonly password: string;
}
