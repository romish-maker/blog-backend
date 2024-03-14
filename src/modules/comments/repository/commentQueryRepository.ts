import { ObjectId } from 'mongodb'
import {commentsCollection} from "../../../app/config/db";
import {ResultToRouterStatus} from "../../common/enums/ResultToRuterStatus";
import {commentMapper} from "../mappers/comment-mapper";

export const commentsQueryRepository = {
    async getCommentById(commentId: string) {
        const comment = await commentsCollection.findOne({ _id: new ObjectId(commentId) })

        if (!comment) {
            return {
                status: ResultToRouterStatus.NOT_FOUND,
            }
        }

        return {
            status: ResultToRouterStatus.SUCCESS,
            data: commentMapper(comment),
        }
    },
    async getCommentDbModelById(commentId: string) {
        const comment = await commentsCollection.findOne({ _id: new ObjectId(commentId) })

        if (!comment) {
            return {
                status: ResultToRouterStatus.NOT_FOUND,
            }
        }

        return {
            status: ResultToRouterStatus.SUCCESS,
            data: comment,
        }
    }
}