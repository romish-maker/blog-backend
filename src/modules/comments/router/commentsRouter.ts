import { Response, Router } from 'express'
import {RequestParams, RequestParamsBody} from "../../common/types";
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {jwtAuthMiddleware} from "../../../app/config/middleware/jwtAuthMiddleware";
import {usersQueryRepository} from "../../users/repository/usersQueryRepository";
import {CommentInputModel} from "../models/CommentInputModel";
import {ResultToRouterStatus} from "../../common/enums/ResultToRuterStatus";
import {commentsService} from "../services/commentServices";
import {commentsQueryRepository} from "../repository/commentQueryRepository";
import {commentInputValidation} from "../validations/commentsValidations";

export const commentsRouter = Router()

commentsRouter.get('/:commentId', async (req: RequestParams<{ commentId: string }>, res) => {
    const result = await commentsQueryRepository.getCommentById(req.params.commentId)
    if (result.status === ResultToRouterStatus.NOT_FOUND) {
        return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    return res.status(HttpStatusCode.OK_200).send(result.data)
})

commentsRouter.put(
    '/:commentId',
    jwtAuthMiddleware,
    commentInputValidation(),
    async (req: RequestParamsBody<{ commentId: string }, CommentInputModel>, res: Response) => {
        const user = await usersQueryRepository.getUserById(req.userId)
        if(!user || !req.params.commentId) {
            return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        }

        const result = await commentsService.updateComment(req.params.commentId, user.id, { content: req.body.content })

        if (result.status === ResultToRouterStatus.NOT_FOUND) {
            return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        } else if (result.status === ResultToRouterStatus.FORBIDDEN) {
            return res.sendStatus(HttpStatusCode.FORBIDDEN_403)
        }

        return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
    })

commentsRouter.delete(
    '/:commentId',
    jwtAuthMiddleware,
    async (req: RequestParamsBody<{ commentId: string }, CommentInputModel>, res: Response) => {
        const user = await usersQueryRepository.getUserById(req.userId)
        if(!user || !req.params.commentId) {
            return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        }

        const result = await commentsService.deleteComment(req.params.commentId, user.id)

        if (result.status === ResultToRouterStatus.NOT_FOUND) {
            return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        } else if (result.status === ResultToRouterStatus.FORBIDDEN) {
            return res.sendStatus(HttpStatusCode.FORBIDDEN_403)
        }

        return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
    })