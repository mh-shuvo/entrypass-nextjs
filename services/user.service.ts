import {UserRepository} from "@/repository/user.repository";
import bcrypt from "bcryptjs";
import {UserCreateSchema,UserCreateState} from "@/lib/validation/user.ts"
export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getAllUsers() {
        return this.userRepository.findAllUsers();
    },

    async createUser(payload:UserCreateState){
        // 1. Validate shape/format — same schema your form already uses
        const parsed = UserCreateSchema.parse(input); // throws ZodError if invalid

        // 2. Business rule: passwords must match
        if (parsed.password !== parsed.confirmPassword) {
          throw new Error("Passwords do not match");
        }
    }
}