import {ObjectId} from "mongodb";
import {QueryUserInputModel} from "../models/QueryUserInputModel";
import {usersCollection} from "../../../app/config/db";
import {usersMapper} from "../mapper/user-mapper";
import {Pagination} from "../../../app/models/Pagination";
import {UserViewModel} from "../models/UserViewModel";

export const usersQueryRepository = {
    async getUsers(sortData: QueryUserInputModel): Promise<Pagination<UserViewModel>> {
        let filter: any = { $or: [] }

        if (sortData.searchLoginTerm) {
            filter.$or.push({ login: { $regex: sortData.searchLoginTerm, $options: 'i' }})
        }

        if (sortData.searchEmailTerm) {
            filter.$or.push({ email: { $regex: sortData.searchEmailTerm, $options: 'i' }})
        }
        if (!filter.$or.length) {
            filter = {}
        }

        const foundUsers = await usersCollection
            .find(filter)
            .sort({ [sortData.sortBy]: sortData.sortDirection === 'asc' ? 1 : -1 })
            .skip((sortData.pageNumber - 1) * sortData.pageSize)
            .limit(sortData.pageSize)
            .toArray()

        const totalCount = await usersCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / sortData.pageSize)
        const mappedUsers = foundUsers.map(usersMapper)

        return {
            pagesCount,
            page: sortData.pageNumber,
            pageSize: sortData.pageSize,
            totalCount,
            items: mappedUsers,
        }
    },
    async getUserById(userId: string) {
        const foundUser = await usersCollection.findOne({ _id: new ObjectId(userId) })

        if (!foundUser) {
            return null
        }

        return usersMapper(foundUser)
    }
}