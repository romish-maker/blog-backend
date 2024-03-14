import { ObjectId } from 'mongodb'
import {usersCollection} from "../../../app/config/db";
import {authMappers} from "../mapper/auth-mapper";

export const authQueryRepository = {
    async getUserMeModelById(userId: string) {
        const foundUser = await usersCollection.findOne({ _id: new ObjectId(userId) })

        return foundUser && authMappers(foundUser)
    }
}