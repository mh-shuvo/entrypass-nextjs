import {UserRepository} from "@/repository/user.repository";
import type { SafeUser } from "@/repository/user.repository";
import bcrypt from "bcryptjs";
import type { UserCreateState } from "@/lib/validation/user";
import prisma from "@/lib/prisma";
export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getAllUsers(page: number = 1): Promise<SafeUser[]> {
        return this.userRepository.findAllUsers(page);
    }

    async createUser(payload:UserCreateState): Promise<SafeUser>{
        // Listed field by field so `confirmPassword` — and anything added to the
        // form later — can never reach the database by accident.

        const userData = {
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
        }

        if (payload.userId === undefined) {
            if (!payload.password) {
                throw new Error("Password is required for create request.");
            }

            const hashedPassword = await bcrypt.hash(payload.password, 10);
            
            return this.userRepository.create({
                ...userData,
                password: hashedPassword,
            });
        }

        return prisma.user.update({
            where: {
                id: payload.userId,
            },
            data: userData,
        });
    }

    async getUserById(id: number): Promise<SafeUser | null> {
        return this.userRepository.findUserById(id);
    }
}