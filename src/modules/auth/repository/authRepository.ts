import {sessionsCollection, usersCollection} from "../../../app/config/db";
import {UserDbModel} from "../../users/models/UserDbModel";

export const authRepository = {
    async registerUser(newUserRegistration: UserDbModel) {
        const result = await usersCollection.insertOne(newUserRegistration)

        return result.insertedId.toString()
    },
    async updateUser(filter: any, updateUser: UserDbModel) {
        const result = await usersCollection.updateOne(
            filter,
            { $set: updateUser },
        )

        return Boolean(result.modifiedCount === 1)
    },
    async confirmUser(confirmationCode: string) {
        const result = await usersCollection.updateOne(
            { 'confirmationData.confirmationCode': confirmationCode },
            { $set: { 'confirmationData.isConfirmed': true } },
        )

        return Boolean(result.modifiedCount === 1)
    },
    async addRefreshTokenToBlackList(userId: string, refreshToken: string) {
        let result
        const userSession = await sessionsCollection.findOne({ userId })

        if (!userSession?.refreshTokensBlackList) {
            result = await sessionsCollection.insertOne({ userId, refreshTokensBlackList: [refreshToken] })
            return Boolean(result.insertedId.toString())
        } else if (userSession.refreshTokensBlackList) {
            result = await sessionsCollection.updateOne({ userId }, { $push: { refreshTokensBlackList: refreshToken } })
            return Boolean(result.matchedCount)
        }

        return false
    }
}