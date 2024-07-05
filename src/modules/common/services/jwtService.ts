
import jwt, {JwtPayload} from 'jsonwebtoken'
import { WithId } from 'mongodb'
import { AppSettings } from '../../../app/appSettings'
import {UserDbModel} from "../../users/models/UserDbModel";

export const jwtService = {
    async createAccessToken(user: WithId<UserDbModel>) {
        if (!AppSettings.ACCESS_JWT_SECRET) {
            return false
        }

        return jwt.sign({ userId: user._id }, AppSettings.ACCESS_JWT_SECRET, { expiresIn: AppSettings.ACCESS_JWT_EXPIRES })
    },
    async createRefreshToken(user: WithId<UserDbModel>) {
        if (!AppSettings.REFRESH_JWT_SECRET) {
            return false
        }

        return jwt.sign({ userId: user._id }, AppSettings.REFRESH_JWT_SECRET, { expiresIn: AppSettings.REFRESH_JWT_EXPIRES })
    },
    async createTokenPair(user: WithId<UserDbModel>) {
        const accessToken = await this.createAccessToken(user)
        const refreshToken = await this.createRefreshToken(user)

        return { accessToken, refreshToken }
    },
    async getUserIdByToken(token: string): Promise<string | null> {
        if (!AppSettings.ACCESS_JWT_SECRET) {
            return null
        }

        try {
            const res: any = jwt.verify(token, AppSettings.ACCESS_JWT_SECRET)

            return res.userId
        } catch (err) {
            return null
        }
    },
    async getDataByTokenAndVerify(token: string, secretType: 'access' | 'refresh' = 'access'): Promise<JwtPayload | null> {
        const secret = secretType === 'access' ? AppSettings.ACCESS_JWT_SECRET : AppSettings.REFRESH_JWT_SECRET

        if (!secret) {
            return null
        }

        try {
            const res = jwt.verify(token, secret)

            if (typeof res === 'string') {
                return null
            }

            return res
        } catch (err) {
            return null
        }
    },
    async decodeToken(token: string) {
        const tokenData = jwt.decode(token)

        if (!tokenData || typeof tokenData === 'string') {
            return null
        }

        return tokenData
    }
}
