import jwt from 'jsonwebtoken'
import {  WithId } from 'mongodb'
import { AppSettings } from '../../../app/appSettings'
import {UserDbModel} from "../../users/models/UserDbModel";

export const jwtService = {
    async createJWT(user: WithId<UserDbModel>) {
        if (!AppSettings.JWT_SECRET) {
            return false
        }

        return jwt.sign({ userId: user._id }, AppSettings.JWT_SECRET, { expiresIn: AppSettings.JWT_EXPIRES })
    },
    async getUserIdByToken(token: string) {
        if (!AppSettings.JWT_SECRET) {
            return null
        }

        try {
            const res: any = jwt.verify(token, AppSettings.JWT_SECRET)

            return res.userId
        } catch (err) {
            return null
        }
    }
}