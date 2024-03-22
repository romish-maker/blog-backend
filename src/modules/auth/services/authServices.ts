import {authRepository} from "../repository/authRepository";
import {cryptService} from "../../common/services/cryptServices";
import {jwtService} from "../../common/services/jwtService";
import {UserInputModel} from "../../users/models/UserInputModel";
import {ConfirmationInfoModel} from "../../users/models/ConfirmationInfoModel";
import { v4 as uuidv4 } from 'uuid';
import {add} from "date-fns";
import {UserDbModel} from "../../users/models/UserDbModel";
import {ResultToRouterStatus} from "../../common/enums/ResultToRuterStatus";
import {emailManager} from "../../common/managers/emailManager";
import {authQueryRepository} from "../repository/authQueryRepository";
import {ResultToRouter} from "../../common/types";
import {ErrorMessageHandleResult, errorMessagesHandleService} from "../../common/services/errorMessagesHandleService";

export const authServices = {
    async checkUser(loginOrEmail: string, password: string) {
        const user = await authQueryRepository.getUserByLoginOrEmail(loginOrEmail)
        if (!user) {
            return false
        }

        const isPasswordValid = await cryptService.checkPassword(password, user.userData.passwordHash)

        if (!isPasswordValid) {
            return false
        }

        return await jwtService.createJWT(user)
    },
    async registerUser(payload: UserInputModel) {
        const { login, email, password } = payload
        const passwordHash = await cryptService.generateHash(password)

        const userData = {
            login,
            email,
            passwordHash,
            createdAt: new Date().toISOString(),
        }
        const confirmationData: ConfirmationInfoModel = {
            confirmationCode: uuidv4(),
            confirmationCodeExpirationDate: add(new Date(), {
                hours: 1,
                minutes: 1,
            }),
            isConfirmed: false,
        }

        const newUserRegistration: UserDbModel = {
            userData,
            confirmationData,
        }

        await authRepository.registerUser(newUserRegistration)

        try {
            const mailInfo = await emailManager.sendRegistrationEmail(email, confirmationData.confirmationCode)
            console.log('mailInfo: ', mailInfo)
        } catch (err) {
            console.error('error: ', err)
        }

        return {
            status: ResultToRouterStatus.SUCCESS,
            data: null,
        }
    },
    async confirmUser(confirmationCode: string): Promise<ResultToRouter<ErrorMessageHandleResult | null>> {
        const userToConfirm = await authQueryRepository.getUserByConfirmationCode(confirmationCode)

        if (userToConfirm?.confirmationData.confirmationCode !== confirmationCode) {
            return {
                status: ResultToRouterStatus.BAD_REQUEST,
                data: errorMessagesHandleService({ message: 'Incorrect verification code', field: 'code' }),
            }
        }
        if (userToConfirm.confirmationData.isConfirmed) {
            return {
                status: ResultToRouterStatus.BAD_REQUEST,
                data: errorMessagesHandleService({ message: 'Registration was already confirmed', field: 'code' }),
            }
        }
        if (userToConfirm.confirmationData.confirmationCodeExpirationDate < new Date()) {
            return {
                status: ResultToRouterStatus.BAD_REQUEST,
                data: errorMessagesHandleService({ message: 'Confirmation code expired', field: 'code' }),
            }
        }

        const confirmationResult = await authRepository.confirmUser(confirmationCode)
        if (!confirmationResult) {
            return {
                status: ResultToRouterStatus.BAD_REQUEST,
                data: errorMessagesHandleService({ message: 'Ups! Something goes wrong...', field: 'code' }),
            }
        }

        return {
            status: ResultToRouterStatus.SUCCESS,
            data: null,
        }
    },
    async resendConfirmationCode(email: string) {
        const user = await authQueryRepository.getUserByLoginOrEmail(email)

        if (!user) {
            return {
                status: ResultToRouterStatus.BAD_REQUEST,
                data: errorMessagesHandleService({ message: 'You have not registered yet', field: 'email' }),
            }
        }
        if (user.confirmationData.isConfirmed) {
            return {
                status: ResultToRouterStatus.BAD_REQUEST,
                data: errorMessagesHandleService({ message: 'Registration was already confirmed', field: 'email' }),
            }
        }

        const updatedUser: UserDbModel = {
            ...user,
            confirmationData: {
                ...user.confirmationData,
                confirmationCode: uuidv4(),
                confirmationCodeExpirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 1,
                }),
            },
        }

        await authRepository.updateUser({ 'userData.email': email }, updatedUser)

        try {
            const mailInfo = await emailManager.resendRegistrationEmail(email, updatedUser.confirmationData.confirmationCode)
            console.log('@> Information::mailInfo: ', mailInfo)
        } catch (err) {
            console.error('@> Error::emailManager: ', err)
        }

        return {
            status: ResultToRouterStatus.SUCCESS,
            data: null,
        }
    },
}