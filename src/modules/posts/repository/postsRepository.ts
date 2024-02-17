import { postsCollection } from '../../../app/config/db'
import {PostInputModel} from "../models/PostInputModel";
import {blogRepository} from "../../blogs/repository/blogRepository";
import {PostViewModel} from "../models/PostViewModel";

export const postsRepository = {
    async getAllPosts() {
        return postsCollection.find({}).toArray()
    },
    async getPostById(postId: string) {
        return postsCollection.findOne({ id: postId })
    },
    async createNewPost(payload: PostInputModel) {
        const blogData = await blogRepository.getBlogById(payload.blogId)

        if (!blogData) return false

        const createdPost: PostViewModel = {
            id: String(Date.now()),
            title: payload.title,
            shortDescription: payload.shortDescription,
            content: payload.content,
            blogId: payload.blogId,
            blogName: blogData.name,
            createdAt: new Date().toISOString(),
        }

        await postsCollection.insertOne({ ...createdPost })

        return createdPost
    },
    async updatePostById(payload: PostInputModel, postId: string) {
        const foundBlog = await blogRepository.getBlogById(payload.blogId)

        if (!foundBlog) return false

        const updatedResult = await postsCollection.updateOne({ id: postId }, { $set: {
                title: payload.title,
                shortDescription: payload.shortDescription,
                content: payload.content,
                blogId: payload.blogId,
            }})

        return Boolean(updatedResult.matchedCount)
    },
    async deletePostById(postId: string) {
        const deletedResult = await postsCollection.deleteOne({ id: postId })

        return Boolean(deletedResult.deletedCount)
    }
}