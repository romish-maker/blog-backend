import {CommentatorInfoType} from "./CommentatorInfoType";

export type CommentDbType = {
    postId: string
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
}