import {devicesMappers} from "../mappers/devicesMapper";
import {sessionsCollection} from "../../../app/config/db";

export const devicesQueryRepository = {
    async getDevices(userId: string) {
        const authSessions = await sessionsCollection.find({ userId }).toArray()

        return authSessions.map(devicesMappers.mapSessionsToDevicesView)
    },
    async getAuthSessionByDeviceId(deviceId: string) {
        return await sessionsCollection.findOne({deviceId})
    },
    async isAuthSessionExist(userId: string, deviceId: string, iat?: number) {
        return await sessionsCollection.findOne({
            userId,
            deviceId,
            iat,
        })
    },
}