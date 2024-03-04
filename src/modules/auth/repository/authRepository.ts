import {usersCollection} from "../../../app/config/db";

export const authRepository = {
    async getUserPasswordHash(loginOrEmail: string) {
        const users = await usersCollection.find({
            $or: [
                { login: loginOrEmail },
                { email: loginOrEmail },
            ]
        }).toArray()

        if (users.length !== 1) {
            return false
        }

        return users[0].passwordHash
    }
}