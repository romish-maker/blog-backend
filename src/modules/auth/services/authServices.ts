import {authRepository} from "../repository/authRepository";
import {cryptService} from "../../common/services/cryptServices";
import {jwtService} from "../../common/services/jwtService";

export const authServices = {
    async checkUser(loginOrEmail: string, password: string) {
        const user = await authRepository.getUser(loginOrEmail)
        if (!user) {
            return false
        }

        const isPasswordValid = await cryptService.checkPassword(password, user.passwordHash)

        if (!isPasswordValid) {
            return false
        }

        return await jwtService.createJWT(user)
    },
}