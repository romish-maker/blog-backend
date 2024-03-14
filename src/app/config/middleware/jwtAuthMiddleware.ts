import { NextFunction, Request, Response } from 'express'
import { jwtService } from '../../../modules/common/services/jwtService'
import { HttpStatusCode } from '../../../modules/common/enums/HttpsStatusCodes'


export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization || !req.headers.authorization.includes('Bearer')) {
        res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
        return
    }

    const token = req.headers.authorization.split(' ')?.[1]
    const userId = await jwtService.getUserIdByToken(token)

    if (userId) {
        req.userId = userId
        next()
        return
    }

    res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
}
