import {UserInputModel} from "../models/UserInputModel";
import {cryptService} from "../../common/services/cryptServices";
import {UserDataModel} from "../models/UserDataModel";
import {ConfirmationInfoModel} from "../models/ConfirmationInfoModel";
import {UserDbModel} from "../models/UserDbModel";
import {usersRepository} from "../repository/usersRepository";
import {usersQueryRepository} from "../repository/usersQueryRepository";

export const UsersServices = {
    async createUser(payload: UserInputModel) {
        const passwordHash = await cryptService.generateHash(payload.password)

        const userData: UserDataModel = {
            login: payload.login,
            email: payload.email,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString(),
        }
        const confirmationData: ConfirmationInfoModel = {
            confirmationCode: '',
            confirmationCodeExpirationDate: new Date(),
            isConfirmed: true,
        }

        const newUser: UserDbModel = {
            userData,
            confirmationData,
        }

        return usersRepository.createUser(newUser)
    },
    async deleteUser(userId: string) {
        const foundUser = await usersQueryRepository.getUserById(userId)

        if (!foundUser) {
            return false
        }

        return usersRepository.deleteUser(userId)
    }
}
