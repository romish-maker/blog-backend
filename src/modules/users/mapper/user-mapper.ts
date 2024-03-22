import {WithId} from "mongodb";
import {UserDbType} from "../db/user-db";
import {UserViewModel} from "../models/UserViewModel";
import {UserDbModel} from "../models/UserDbModel";

export const usersMapper = (user: WithId<UserDbModel>): UserViewModel => {
    return {
        id: user._id.toString(),
        login: user.userData.login,
        email: user.userData.email,
        createdAt: user.userData.createdAt
    }
}