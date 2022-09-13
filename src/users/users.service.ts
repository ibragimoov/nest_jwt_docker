import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { RolesService } from "src/roles/roles.service";
import { AddRoleDto } from "./dto/add-role.dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./users.model";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private roleService: RolesService
    ) {}

    async createUser(dto: CreateUserDto) {
        const candidate = await this.getUserByEmail(dto.email);

        if (candidate) {
            throw new HttpException(
                "Пользователь с таким email уже зарегистрирован",
                HttpStatus.BAD_REQUEST
            );
        }

        const user = await this.userRepository.create(dto);
        const role = await this.roleService.getRoleByValue("ADMIN");
        await user.$set("roles", [role.id]);
        user.roles = [role];
        return user;
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({
            include: { all: true },
        });
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            include: { all: true },
        });
        return user;
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);

        if (user && role) {
            await user.$add("role", role.id);
            return dto;
        }
        throw new HttpException(
            "Пользователь или роль не найдены",
            HttpStatus.NOT_FOUND
        );
    }

    async ban(dto: BanUserDto) {
        const user = await this.userRepository.findByPk(dto.userId);

        if (user) {
            user.banned = true;
            user.banReason = dto.banReason;
            await user.save();

            return user;
        }

        throw new HttpException(
            "Пользователь или роль не найдены",
            HttpStatus.NOT_FOUND
        );
    }
}
