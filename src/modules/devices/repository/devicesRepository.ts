import {sessionsCollection} from "../../../app/config/db";

export const devicesRepository = {
    async deleteAllOtherSessions(userDevicesIdsWithoutCurrent: string[]) {
        const result = await sessionsCollection.deleteMany({
            deviceId: { $in: userDevicesIdsWithoutCurrent },
        })

        return result.deletedCount
    },

    async deleteSessionByDeviceId(deviceId: string) {
        const result = await sessionsCollection.deleteOne({ deviceId })

        return Boolean(result.deletedCount)
    },
}