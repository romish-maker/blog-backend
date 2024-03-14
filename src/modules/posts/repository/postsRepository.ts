import {commentsCollection, postsCollection} from '../../../app/config/db'
import {PostInputModel} from "../models/PostInputModel";
import {PostViewModel} from "../models/PostViewModel";
import {postsMapper} from "../mapper/posts-mapper";
import {ObjectId} from "mongodb";
import {PostDbType} from "../db/post-db";
import {CommentDbType} from "../../comments/models/CommentDbType";

export const postsRepository = {
    async getPostById(postId: string): Promise<PostViewModel | null> {
        const post = await postsCollection.findOne({_id: new ObjectId(postId)})

        if (!post) {
            return null
        }

        return postsMapper(post)
    },
    async createPost(payload: PostDbType): Promise<string> {
        const response = await postsCollection.insertOne(payload)

        return response.insertedId.toString()
    },
    async createCommentToPost(newComment: CommentDbType) {
        const result = await commentsCollection.insertOne(newComment)

        return result.insertedId.toString()
    },
    async updatePost(payload: PostInputModel, postId: string) {
        const updateResult = await postsCollection.updateOne({_id: new ObjectId(postId)}, {
            $set: {
                title: payload.title,
                shortDescription: payload.shortDescription,
                content: payload.content,
                blogId: payload.blogId,
            }
        })

        return Boolean(updateResult.matchedCount)
    },
    async deletePostById(postId: string) {
        const deleteResult = await postsCollection.deleteOne({_id: new ObjectId(postId)})

        return Boolean(deleteResult.deletedCount)
    }
}