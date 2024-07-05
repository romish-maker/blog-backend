import {devicesQueryRepository} from "../repository/devicesQueryRepository";
import {devicesRepository} from "../repository/devicesRepository";
import {jwtService} from "../../common/services/jwtService";

export const devicesService = {
    async checkAuthSessionByRefreshToken(refreshToken: string) {
        const tokenData = await this.getTokenData(refreshToken)
        if (!tokenData) {
            return false
        }

        return await devicesQueryRepository.isAuthSessionExist(tokenData.userId, tokenData.deviceId, tokenData?.iat);
    },
    async deleteAllOtherSessions(currentDeviceId: string, refreshToken: string) {
        const tokenData = await this.getTokenData(refreshToken)
        if (!tokenData) {
            return false
        }

        const userDevices = await devicesQueryRepository.getDevices(tokenData.userId)
        const userDevicesIdsWithoutCurrent = userDevices
            .map((deviceData) => deviceData.deviceId)
            .filter((deviceId) => deviceId !== currentDeviceId)

        return await devicesRepository.deleteAllOtherSessions(userDevicesIdsWithoutCurrent)
    },
    async deleteSessionByDeviceId(deviceId: string) {
        return devicesRepository.deleteSessionByDeviceId(deviceId)
    },
    async getTokenData(refreshToken: string) {
        return jwtService.getDataByTokenAndVerify(refreshToken, 'refresh')
    },
}