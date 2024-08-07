export type SessionsDbModel = {
    userId: string
    deviceId: string
    deviceName: string
    ip: string
    iat: number
    exp: number
    refreshTokensBlackList?: string[]
}