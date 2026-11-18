import { IsEnum, IsIn } from "class-validator";
import { CreateUserDto } from "./create-user.dto.js";
import { UserRole } from "../../common/enums/user-role.enum.js";

// admin-create-user.dto.ts — untuk admin
export class AdminCreateUserDto extends CreateUserDto {
    @IsIn(Object.values(UserRole))
    role: UserRole;
}