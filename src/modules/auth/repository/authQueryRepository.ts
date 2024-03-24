import {ObjectId} from 'mongodb'
import {sessionsCollection, usersCollection} from "../../../app/config/db";
import {authMappers} from "../mapper/auth-mapper";

export const authQueryRepository = {
    async getUserMeModelById(userId: string) {
        const foundUser = await usersCollection.findOne({ _id: new ObjectId(userId) })

        return foundUser && authMappers(foundUser)
    },
    async getUserByConfirmationCode(confirmationCode: string) {
        return await usersCollection.findOne({'confirmationData.confirmationCode': confirmationCode})
    },
    async getUserByLoginOrEmail(loginOrEmail: string) {
        const users = await usersCollection.find({
            $or: [
                { 'userData.login': loginOrEmail },
                { 'userData.email': loginOrEmail },
            ]
        }).toArray()

        if (users.length !== 1) {
            return false
        }

        return users[0]
    },
    async getIsRefreshTokenValid(userId: string, refreshToken: string) {
        const userSession = await sessionsCollection.findOne({ userId })

        if (!userSession) {
            await sessionsCollection.insertOne({ userId, refreshTokensBlackList: [] })
        }

        return !userSession?.refreshTokensBlackList.includes(refreshToken)
    }
}