import {WithId} from "mongodb";
import {CommentDbType} from "../models/CommentDbType";

export const commentMapper = (commentFromDb: WithId<CommentDbType>) => {
    return {
        id: commentFromDb._id.toString(),
        content: commentFromDb.content,
        commentatorInfo: commentFromDb.commentatorInfo,
        createdAt: commentFromDb.createdAt,
    }
}