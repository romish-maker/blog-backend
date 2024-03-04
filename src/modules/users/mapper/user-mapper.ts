import {WithId} from "mongodb";
import {UserDbType} from "../db/user-db";
import {UserViewModel} from "../models/UserViewModel";

export const usersMapper = (user: WithId<UserDbType>): UserViewModel => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}