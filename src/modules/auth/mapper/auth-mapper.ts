import { WithId } from 'mongodb'
import {UserDbType} from "../../users/db/user-db";
import {MeViewModel} from "../models/MeViewModel";

export const authMappers = (user: WithId<UserDbType>): MeViewModel => {
        return {
            email: user.email,
            login: user.login,
            userId: user._id.toString(),
        }
}