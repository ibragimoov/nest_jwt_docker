import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requieresRoles = this.reflector.getAllAndOverride<string[]>(
                ROLES_KEY,
                [context.getHandler(), context.getClass()]
            );

            if (!requieresRoles) {
                return true;
            }
            const req = context.switchToHttp().getRequest();
            const header = req.headers.authorization;
            const bearer = header.split(" ")[0];
            const token = header.split(" ")[1];

            if (bearer !== "Bearer" || !token) {
                throw new UnauthorizedException({
                    message: "Пользователь не авторизован",
                });
            }

            const user = this.jwtService.verify(token);
            req.user = user;
            return user.roles.some((role) =>
                requieresRoles.includes(role.value)
            );
        } catch (error) {
            console.log(error);
            throw new HttpException("Нет доступа", HttpStatus.FORBIDDEN);
        }
    }
}
