import { NextFunction, Request, Response } from 'express'
import {RateLimitModel} from "../../../modules/auth/models/RateLimitModel";
import {rateLimitCollection} from "../db";
import {HttpStatusCode} from "../../../modules/common/enums/HttpsStatusCodes";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const currentTime = new Date();
    const rateLimitData: RateLimitModel = {
        ip: req.ip ?? 'no_ip',
        url: req.originalUrl,
        date: currentTime,
    }
    await rateLimitCollection.insertOne(rateLimitData)

    const tenSecondsAgo = new Date(currentTime.getTime() - 10 * 1000);

    const urlSessions = await rateLimitCollection.find({
        ip: rateLimitData.ip,
        url: rateLimitData.url,
        date: { $gte: tenSecondsAgo },
    }).toArray()
    const urlCount = urlSessions.length

    if (urlCount > 5) {
        return res.sendStatus(HttpStatusCode.TOO_MANY_REQUESTS_429)
    }

    return next()
}