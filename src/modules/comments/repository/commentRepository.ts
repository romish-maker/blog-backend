import { ObjectId } from 'mongodb'
import {CommentDbType} from "../models/CommentDbType";
import {commentsCollection} from "../../../app/config/db";

export const commentRepository = {
    async updateComment(commentId: string, updatedComment: CommentDbType) {
        const result = await commentsCollection.updateOne(
            { _id: new ObjectId(commentId) },
            { $set: updatedComment },
        )

        return Boolean(result.matchedCount)
    },
    async deleteComment(commentId: string) {
        const result = await commentsCollection.deleteOne({ _id: new ObjectId(commentId) })

        return Boolean(result.deletedCount)
    }
}