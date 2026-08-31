import {UserRepository} from "@/repository/user.repository";
import bcrypt from "bcryptjs";
import { UserCreateSchema, UserCreateState } from "@/lib/validation/user";
export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getAllUsers() {
        return this.userRepository.findAllUsers();
    }

    async createUser(payload:UserCreateState){
        //TODO: Remove confirm password and hash the password then store password
    }
}