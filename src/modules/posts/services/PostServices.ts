import {PostDbType} from "../db/post-db";
import {postsRepository} from "../repository/postsRepository";
import {PostViewModel} from "../models/PostViewModel";
import {PostInputModel} from "../models/PostInputModel";

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