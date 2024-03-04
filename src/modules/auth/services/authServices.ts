import {authRepository} from "../repository/authRepository";
import {cryptService} from "../../common/services/cryptServices";

export const authServices = {
    async checkUser(loginOrEmail: string, password: string) {
        const userPasswordHash = await authRepository.getUserPasswordHash(loginOrEmail, password)

        if (!userPasswordHash) {
            return false
        }

        return await cryptService.checkPassword(password, userPasswordHash)
    },
}