import {CommentInputModel} from "../models/CommentInputModel";
import {CommentDbType} from "../models/CommentDbType";
import {ResultToRouterStatus} from "../../common/enums/ResultToRuterStatus";
import {commentRepository} from "../repository/commentRepository";
import {commentsQueryRepository} from "../repository/commentQueryRepository";

export const commentsService = {
    async updateComment(commentId: string, userId: string, payload: CommentInputModel) {
        const commentResult = await this.getCommentResult(commentId, userId)

        if (commentResult.status !== ResultToRouterStatus.SUCCESS) {
            return commentResult
        }

        const updatedComment: CommentDbType = {
            postId: commentResult.data!.postId,
            content: payload.content,
            commentatorInfo: commentResult.data!.commentatorInfo,
            createdAt: commentResult.data!.createdAt,
        }

        const updateResult = await commentRepository.updateComment(commentId, updatedComment)
        if (!updateResult) {
            return {
                status: ResultToRouterStatus.NOT_FOUND
            }
        }

        return {
            status: ResultToRouterStatus.SUCCESS
        }
    },
    async deleteComment(commentId: string, userId: string) {
        const commentResult = await this.getCommentResult(commentId, userId)

        if (commentResult.status !== ResultToRouterStatus.SUCCESS) {
            return commentResult
        }

        const deleteResult = await commentRepository.deleteComment(commentId)
        if (!deleteResult) {
            return {
                status: ResultToRouterStatus.NOT_FOUND
            }
        }

        return {
            status: ResultToRouterStatus.SUCCESS
        }
    },
    async getCommentResult(commentId: string, userId: string) {
        const commentResult = await commentsQueryRepository.getCommentDbModelById(commentId)

        if (commentResult.status === ResultToRouterStatus.NOT_FOUND) {
            return {
                status: ResultToRouterStatus.NOT_FOUND,
                data: null,
            }
        } else if (commentResult.data?.commentatorInfo.userId !== userId) {
            return {
                status: ResultToRouterStatus.FORBIDDEN,
                data: null,
            }
        }

        return commentResult
    },
}