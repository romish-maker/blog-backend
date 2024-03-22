import {UserDbType} from "../db/user-db";
import { usersCollection} from "../../../app/config/db";
import {ObjectId} from "mongodb";
import {usersMapper} from "../mapper/user-mapper";
import {UserDbModel} from "../models/UserDbModel";

export const usersRepository = {
    async createUser(payload: UserDbModel): Promise<string> {
        const response = await usersCollection.insertOne(payload)

        return response.insertedId.toString()
    },
    async getUserById(userId: string) {
        const foundUser = await usersCollection.findOne({ _id: new ObjectId(userId) })

        if (!foundUser) {
            return null
        }

        return usersMapper(foundUser)
    },
    async deleteUser(userId: string) {
        const deletedResult = await usersCollection.deleteOne({_id: new ObjectId(userId)})

        return Boolean(deletedResult.deletedCount)
    }
}