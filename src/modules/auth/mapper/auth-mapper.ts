import { WithId } from 'mongodb'
import {UserDbType} from "../../users/db/user-db";
import {MeViewModel} from "../models/MeViewModel";
import {UserDbModel} from "../../users/models/UserDbModel";

export const authMappers = (user: WithId<UserDbModel    >): MeViewModel => {
        return {
            email: user.userData.email,
            login: user.userData.login,
            userId: user._id.toString(),
        }
}