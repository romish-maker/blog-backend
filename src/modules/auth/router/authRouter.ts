import {Router, Request, Response} from "express";
import {authPostValidation} from "../validations/authValidation";
import {RequestBody} from "../../common/types";
import {AuthInputModel} from "../models/AuthInputModel";
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {authServices} from "../services/authServices";
import {jwtAuthMiddleware} from "../../../app/config/middleware/jwtAuthMiddleware";
import {authQueryRepository} from "../repository/authQueryRepository";

export const authRouter = Router()

authRouter.post('/login', authPostValidation(), async (req: RequestBody<AuthInputModel>, res: Response) => {
    const token = await authServices.checkUser(req.body.loginOrEmail, req.body.password)

    if (!token) {
        return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
    }

    return res.status(HttpStatusCode.OK_200).send({ accessToken: token })
})

authRouter.get('/me', jwtAuthMiddleware , async (req: Request, res) => {
    const userId = req.userId

    if (!userId) {
        return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
    }

    const user = await authQueryRepository.getUserMeModelById(userId)

    if (!user) {
        return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
    }

    return res.status(HttpStatusCode.OK_200).send(user)
})