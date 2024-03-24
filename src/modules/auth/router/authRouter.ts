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
    const tokens = await authServices.createTokenPair(req.body.loginOrEmail, req.body.password)

    if (!tokens) {
        return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
    }

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true,secure: true })

    return res.status(HttpStatusCode.OK_200).send({ accessToken: tokens.accessToken })
})

authRouter.post('/refresh-token', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
        return
    }

    const updateTokensResult: any = await authServices.updateTokenPair(refreshToken)

    if (updateTokensResult.status === ResultToRouterStatus.NOT_AUTHORIZED) {
        res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
        return
    }

    res.cookie('refreshToken', updateTokensResult.data?.refreshToken, { httpOnly: true,secure: true })
    return res.status(HttpStatusCode.OK_200).send({ accessToken: updateTokensResult.data?.accessToken })
})

authRouter.post('/logout', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
        return
    }

    const logoutResult = await authServices.logoutUser(refreshToken)

    if (logoutResult.status === ResultToRouterStatus.NOT_AUTHORIZED) {
        res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
        return
    }

    res.clearCookie('refreshToken')
    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
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