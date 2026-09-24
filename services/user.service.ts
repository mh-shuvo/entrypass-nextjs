import { UserRepository, safeUserSelect } from "@/repository/user.repository";
import type { SafeUser } from "@/repository/user.repository";
import bcrypt from "bcryptjs";
import { UserType, type Permission } from "@prisma/client";
import type { UserCreateState, UserPasswordChangeState } from "@/lib/validation/user";
import prisma from "@/lib/prisma";

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getAllUsers(page: number = 1, search: string = ""): Promise<SafeUser[]> {
        return this.userRepository.findAllUsers(page, search);
    }

    async countUsers(search: string = ""): Promise<number> {
        return this.userRepository.countUsers(search);
    }

    async createUser(payload: UserCreateState): Promise<SafeUser> {
        // Listed field by field so `confirmPassword` — and anything added to the
        // form later — can never reach the database by accident.

        const userData = {
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            UserType: UserType.EXECUTIVE,
        };

        if (payload.userId === undefined) {
            if (!payload.password) {
                throw new Error("Password is required for create request.");
            }

            const hashedPassword = await bcrypt.hash(payload.password, 10);

            const createdUser = await this.userRepository.create({
                ...userData,
                password: hashedPassword,
            });

            await this.userRepository.createDefaultPermissions(createdUser.id, createdUser.UserType);
            return createdUser;
        }

        return prisma.user.update({
            where: {
                id: payload.userId,
            },
            data: userData,
            select: safeUserSelect,
        });
    }

    async changePassword(payload: UserPasswordChangeState): Promise<SafeUser> {
        if (!payload.password) {
            throw new Error("Password is required for create request.");
        }

        const hashedPassword = await bcrypt.hash(payload.password, 10);
        return prisma.user.update({
            where: {
                id: payload.userId,
            },
            data: {
                password: hashedPassword,
            },
            select: safeUserSelect,
        });
    }

    async getUserById(id: number): Promise<SafeUser | null> {
        return this.userRepository.findUserById(id);
    }

    async updateUserPermissions(userId: number, permissions: Permission[]): Promise<void> {
        await this.userRepository.updateUserPermissions(userId, permissions);
    }
}