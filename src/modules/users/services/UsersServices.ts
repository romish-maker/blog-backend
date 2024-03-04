import {UserInputModel} from "../models/UserInputModel";
import {cryptService} from "../../common/services/cryptServices";
import {UserDbType} from "../db/user-db";
import {usersRepository} from "../repository/usersRepository";

export const UsersServices = {
    async createUser(payload: UserInputModel) {
        const passwordHash = await cryptService.generateHash(payload.password)

        const newUser: UserDbType = {
            login: payload.login,
            email: payload.email,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString(),
        }

        return usersRepository.createUser(newUser)
    },
    async deleteUser(userId: string): Promise<null | boolean> {
        const deletedUser = await usersRepository.getUserById(userId)

        if (!deletedUser) {
            return null
        }

        return usersRepository.deleteUser(userId)
    },
}