import {Router, Response} from "express";
import {authPostValidation} from "../validations/authValidation";
import {RequestBody} from "../../common/types";
import {AuthInputModel} from "../models/AuthInputModel";
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {authServices} from "../services/authServices";

export const authRouter = Router()

authRouter.post('/login', authPostValidation(), async (req: RequestBody<AuthInputModel>, res: Response) => {
    const isAuthPassed = await authServices.checkUser(req.body.loginOrEmail, req.body.password)

    if (!isAuthPassed) {
        return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
    }

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})