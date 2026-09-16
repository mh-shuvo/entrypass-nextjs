import {UserRepository} from "@/repository/user.repository";
import type { SafeUser } from "@/repository/user.repository";
import bcrypt from "bcryptjs";
import type { UserCreateState } from "@/lib/validation/user";
export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getAllUsers(page: number = 1): Promise<SafeUser[]> {
        return this.userRepository.findAllUsers(page);
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

    async getUserById(id: number): Promise<SafeUser | null> {
        return this.userRepository.findUserById(id);
    }
}