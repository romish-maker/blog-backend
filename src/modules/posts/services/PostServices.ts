import {PostDbType} from "../db/post-db";
import {postsRepository} from "../repository/postsRepository";
import {PostViewModel} from "../models/PostViewModel";
import {PostInputModel} from "../models/PostInputModel";
import {usersQueryRepository} from "../../users/repository/usersQueryRepository";
import {postsQueryRepository} from "../repository/postQueryRepository";
import {CommentInputModel} from "../../comments/models/CommentInputModel";
import {ResultToRouterStatus} from "../../common/enums/ResultToRuterStatus";
import {CommentDbType} from "../../comments/models/CommentDbType";
import {commentRepository} from "../../comments/repository/commentRepository";

export const PostServices = {
    async createPost(createPostBody: PostDbType): Promise<PostViewModel | null> {
        const payload: PostDbType = {
            title: createPostBody.title,
            shortDescription: createPostBody.shortDescription,
            content: createPostBody.content,
            blogId: createPostBody.blogId,
            createdAt: createPostBody.createdAt,
            blogName: createPostBody.blogName
        }

        const newPostId = await postsRepository.createPost(payload)

        return await postsRepository.getPostById(newPostId)
    },
    async createCommentToPost(postId: string, userId: string, payload: CommentInputModel) {
        const post = await postsQueryRepository.getPostById(postId)
        const user = await usersQueryRepository.getUserById(userId)

        if (!(post && user)) {
            return {
                status: ResultToRouterStatus.NOT_FOUND
            }
        }

        const newComment: CommentDbType = {
            postId,
            content: payload.content,
            commentatorInfo: {
                userId,
                userLogin: user.login,
            },
            createdAt: new Date().toISOString(),
        }

        const commentId = await postsRepository.createCommentToPost(newComment)

        return {
            status: ResultToRouterStatus.SUCCESS,
            data: { commentId },
        }
    },
    async updatePost(postId: string, updatePostBody: PostInputModel): Promise<boolean | null> {
        const foundPost = await postsRepository.getPostById(postId)

        if (!foundPost) {
            return null
        }

        const payload: PostInputModel = {
            title: updatePostBody.title,
            shortDescription: updatePostBody.shortDescription,
            content: updatePostBody.content,
            blogId: updatePostBody.blogId,
        }

        return await postsRepository.updatePost(payload, postId)
    },
    async deleteBlog(postId: string): Promise<boolean | null> {
        const foundDeletedPost = await postsRepository.getPostById(postId)

        if (!foundDeletedPost) {
            return null
        }


        return await postsRepository.deletePostById(postId)
    }
}