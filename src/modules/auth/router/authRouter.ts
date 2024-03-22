import {Router, Request, Response} from "express";
import {authCodeValidation, authPostValidation, resentEmailValidation} from "../validations/authValidation";
import {RequestBody} from "../../common/types";
import {AuthInputModel} from "../models/AuthInputModel";
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {authServices} from "../services/authServices";
import {jwtAuthMiddleware} from "../../../app/config/middleware/jwtAuthMiddleware";
import {authQueryRepository} from "../repository/authQueryRepository";
import {userInputValidation} from "../../users/validations/usersValidations";
import {UserInputModel} from "../../users/models/UserInputModel";
import {ResultToRouterStatus} from "../../common/enums/ResultToRuterStatus";

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

authRouter.post('/registration', userInputValidation(), async (req: RequestBody<UserInputModel>, res: Response) => {
    await authServices.registerUser(req.body)

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

authRouter.post('/registration-confirmation', authCodeValidation(), async (req: RequestBody<{ code: string }>, res: Response) => {
    const confirmationResult = await authServices.confirmUser(req.body.code)

    if (confirmationResult.status === ResultToRouterStatus.BAD_REQUEST) {
        return res.status(HttpStatusCode.BAD_REQUEST_400).send(confirmationResult.data)
    }

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

authRouter.post('/registration-email-resending', resentEmailValidation(), async (req: RequestBody<{ email: string }>, res: Response) => {
    const resendResult = await authServices.resendConfirmationCode(req.body.email)

    if (resendResult.status === ResultToRouterStatus.BAD_REQUEST) {
        return res.status(HttpStatusCode.BAD_REQUEST_400).send(resendResult.data)
    }

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})