import {UserRepository} from "@/repository/user.repository";
import type { SafeUser } from "@/repository/user.repository";
import bcrypt from "bcryptjs";
import type { UserCreateState } from "@/lib/validation/user";
export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getAllUsers() {
        return this.userRepository.findAllUsers();
    }

    async createUser(payload:UserCreateState): Promise<SafeUser>{
        // Listed field by field so `confirmPassword` — and anything added to the
        // form later — can never reach the database by accident.
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        return this.userRepository.create({
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
        });
    }
}