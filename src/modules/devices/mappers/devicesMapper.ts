import { WithId } from 'mongodb'
import {DeviceViewModel} from "../models/DeviceViewModel";
import {AuthSessionsDbModel} from "../../users/models/AuthSessionsDbModel";

export const devicesMappers = {
    mapSessionsToDevicesView(authSessions: WithId<AuthSessionsDbModel>): DeviceViewModel {
        return {
            ip: authSessions.ip,
            title: authSessions.deviceName,
            lastActiveDate: new Date(authSessions.iat).toISOString(),
            deviceId: authSessions.deviceId,
        }
    },
}