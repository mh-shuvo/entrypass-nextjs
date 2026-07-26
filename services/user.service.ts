import {UserRepository} from "@/repository/user.repository";

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getAllUsers() {
        return this.userRepository.findAllUsers();
    }
}